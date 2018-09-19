/* eslint-disable no-mixed-operators,no-continue,no-await-in-loop,no-param-reassign */
const {
  PRODUCERS_CHECK_INTERVAL,
  GET_INFO_INTERVAL,
  GET_INFO_TOP21_INTERVAL,
  TIMESTAMP_EPOCH,
  SAVE_TABLE_INTERVAL,
  LISTENERS: { ON_PRODUCERS_INFO_CHANGE_INTERVAL },
} = require('config');

const { ProducerModelV2, StateModelV2, connect } = require('../../db');

const { createEosApi, eosApi, castToInt, createLogger, pickAs } = require('../../helpers');
const {
  SERVER_NOT_FOUND,
  CHECK_URLS,
  CONNECTION_REFUSED_BY_SERVER,
  MINIMUM_CHANGED_POSITION_FOR_RELOADING,
  SECOND,
} = require('../../constants');
const createStorage = require('./storage');
const checkMissedProducing = require('./checkMissedProducing');

const { info: logInfo, error: logError } = createLogger();

const saveTable = storage => async () => {
  const table = await storage.getAll();
  StateModelV2.updateOne({ id: 1 }, { table }).exec();
};

const restoreTable = async storage => {
  const state = await StateModelV2.findOne({ id: 1 }).select('table');
  if (state && state.table) {
    storage.replaceAll(state.table);
  }
};

const calculateEosFromVotes = votes => {
  const date = Date.now() / 1000 - TIMESTAMP_EPOCH;
  const weight = parseInt(date / (86400 * 7), 10) / 52; // 86400 = seconds per day 24*3600
  return castToInt(votes) / 2 ** weight / 10000;
};

const isNode = (producer) => {
  if (!producer || !producer.nodes || !producer.nodes.length) {
    return false;
  }
  return !!producer.nodes.find(n => CHECK_URLS.find(type => n[type] && n[type].length));
};

const convertFieldsFromStringToArr = fields => fields.split(' ').map(s => s.trim());

const getProducersInfo = async () => {
  const { total_producer_vote_weight } = await eosApi.getProducers({ json: true, limit: 1 });
  const onePercent = castToInt(total_producer_vote_weight) / 100;
  const fields =
    `url
      location
      produced
      tx_count
      name
      producer_key
      specialNodeEndpoint
      total_votes
      rewards_per_day
      lastGoodAnsweredTime
      isSiteAvailable
      missedBlocks
      missedBlocksForDay
      missedBlocksForRound
      missedBlocksTotal
      checkedData2
      expectedIncomeData
      nodes
      nodes._id
      nodes.enabled
      nodes.bp_name
      nodes.organisation
      nodes.location
      nodes.http_server_address
      nodes.https_server_address
      nodes.p2p_listen_endpoint
      nodes.p2p_server_address
      nodes.pub_key
      nodes.bp`;
  const producersFromDb = await ProducerModelV2
    .find({ isActive: true, total_votes: { $ne: null } })
    .sort({ total_votes: -1 })
    .select(fields)
    .exec();
  return producersFromDb.map(p => (
    {
      ...pickAs(p, convertFieldsFromStringToArr(fields)),
      isNode: isNode(p),
      votesPercentage: p.total_votes / onePercent,
      votesInEOS: calculateEosFromVotes(p.total_votes),
    }));
};

const processNodeAndGetInfo = async (host, port, name, nodeId, wasEnabled) => {
  const localEosApi = createEosApi({ host, port, isVariable: false, onlyRequest: name === 'eostribeprod' });
  const startTs = Date.now();
  let info;

  try {
    info = await localEosApi.getInfo({});
    if (!wasEnabled && nodeId) {
      ProducerModelV2.updateOne(
        { name, 'nodes._id': nodeId },
        {
          $set: { 'nodes.$.enabled': true },
          $push: { 'nodes.$.downtimes': { to: new Date() } },
        },
      ).exec();
    }
  } catch ({ message, statusCode }) {
    if (
      message.indexOf(CONNECTION_REFUSED_BY_SERVER) > 0
      || message.indexOf(SERVER_NOT_FOUND) > 0
      || statusCode >= 500
    ) {
      if (!wasEnabled) {
        return { checked: { name, isNodeBroken: true, requestTS: startTs, isUpdated: true } };
      }
      if (nodeId) {
        await ProducerModelV2.updateOne(
          { name, 'nodes._id': nodeId },
          {
            $set: { 'nodes.$.enabled': false },
            $push: { 'nodes.$.downtimes': { from: new Date() } },
          },
        ).exec();
      }
    }
    return {
      checked: {
        ping: Date.now() - startTs,
        name,
        responseIsBad: true,
        errorMessage: message,
        statusCode,
        isNode: true,
        isNodeBroken: false,
        requestTS: startTs,
      },
    };
  }
  const nowTs = Date.now();
  const ping = nowTs - startTs;
  const version = info.server_version;
  ProducerModelV2.updateOne({ name }, { lastGoodAnsweredTime: new Date() }).exec();
  return {
    head_block_num: info.head_block_num,
    checked: {
      name,
      ping,
      isNodeBroken: false,
      version,
      answeredBlock: info.head_block_num,
      isNode: true,
      requestTS: startTs,
      isUpdated: true,
      isUnsynced: false,
      responseIsBad: false,
      errorMessage: null,
      statusCode: 200,
    },
    // producer: {
    //   name: info.head_block_producer,
    //   isNodeBroken: false,
    //   producedBlock: info.head_block_num,
    //   producedTimestamp: Date.parse(info.head_block_time),
    //   isNode: true,
    //   isUpdated: true,
    // },
  };
};

const getFirstGoodNodeInfo = async nodes => {
  let serverInfo = null;
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    const { _id, bp_name, enabled } = node;

    for (let j = 0; j < CHECK_URLS.length; j += 1) {
      const type = CHECK_URLS[j];
      const protocol = type.startsWith('https') ? 'https' : 'http';
      const address = node[type];

      if (!address) {
        continue;
      }

      const [host, port] = (address || '').split(':');

      if (!!host && host !== '0.0.0.0') {
        serverInfo = await processNodeAndGetInfo(`${protocol}://${host}`, port, bp_name, _id, enabled);
      }

      if (serverInfo && serverInfo.checked && serverInfo.checked.version) {
        break;
      }
    }
    if (serverInfo && serverInfo.checked && serverInfo.checked.version) {
      break;
    }
  }
  return serverInfo;
};

const initProducerHandler = async () => {
  const producersListForNodeChecking = [];
  const storage = createStorage();
  const serialNumber = {
    top: 0,
    other: 0,
  };

  const previousProducersOrder = [];

  const updateProducersListForNodeChecking = async () => {
    producersListForNodeChecking.length = 0;
    producersListForNodeChecking.push(...await storage.getAll());
  };

  const setCurrentInfo = ({ info }) => {
    storage.updateGeneralInfo(info);
  };

  const checkMissedProducingTime = async () => {
    const top21 = (await storage.getAll()).slice(0, 21);
    storage.updateMissedProducing(checkMissedProducing(top21));
  };

  const notify = (type) => async () => {
    if (type === 'all') {
      process.send({ message: 'all', data: storage.getAll() });
    } else if (type === 'order') {
      process.send({ message: 'order', data: storage.getAll() });
    } else {
      const updated = await storage.getUpdated();
      if (updated.length < 1) {
        return;
      }
      process.send({ message: 'updated', data: updated });
    }
  };
  const notifyOrderChange = notify('order');

  const checkProducers = async () => {
    try {
      const producers = await getProducersInfo();
      storage.updateProducers(producers);
      const nextProducersOrder = (await storage.getAll()).map(p => p.name);
      const orderIsChanged = nextProducersOrder.find((e, i) => e !== previousProducersOrder[i]);
      if (orderIsChanged) {
        const minimumChangedPosition = nextProducersOrder.reduceRight((prevIndex, e, index) =>
          (e !== previousProducersOrder[index] ? index : prevIndex));
        previousProducersOrder.length = 0;
        previousProducersOrder.push(...nextProducersOrder);
        if (MINIMUM_CHANGED_POSITION_FOR_RELOADING >= minimumChangedPosition) {
          notifyOrderChange();
        }
      }
    } catch (e) {
      logInfo('Data about producers not received');
      logError(e);
    }
  };

  const checkInfo = producersType => async () => {
    try {
      const slicedProducers = producersType === 'top'
        ? producersListForNodeChecking.slice(0, 21)
        : producersListForNodeChecking.slice(21);

      const producers = slicedProducers.filter(e => e.isNode);

      if (!producers.length) {
        return;
      }

      serialNumber[producersType] =
        producers.length <= serialNumber[producersType] ? 1 : serialNumber[producersType] + 1;

      const producer = producers[serialNumber[producersType] - 1];
      if (!producer) {
        return;
      }
      const { nodes, specialNodeEndpoint, name } = producer;

      if (specialNodeEndpoint && specialNodeEndpoint.use) {
        const { host, port } = specialNodeEndpoint;
        try {
          const info = await processNodeAndGetInfo(host, port, name);
          storage.updateNodeInfo(info);
          return;
        } catch (e) {
          logError(`Special endpoint of ${name} does not work`);
        }
      }

      if (!nodes || !nodes.length) {
        return;
      }
      try {
        const info = await getFirstGoodNodeInfo(nodes);
        storage.updateNodeInfo(info);
      } catch (e) {
        logInfo(`Info of ${name} not received`);
      }
    } catch (e) {
      logError(e);
    }
  };
  restoreTable(storage);
  connect();

  setInterval(checkProducers, PRODUCERS_CHECK_INTERVAL);
  setInterval(checkInfo('other'), GET_INFO_INTERVAL);
  setInterval(checkInfo('top'), GET_INFO_TOP21_INTERVAL);
  setInterval(saveTable(storage), SAVE_TABLE_INTERVAL);
  setInterval(checkMissedProducingTime, PRODUCERS_CHECK_INTERVAL);
  setInterval(updateProducersListForNodeChecking, PRODUCERS_CHECK_INTERVAL);

  setInterval(notify('updated'), ON_PRODUCERS_INFO_CHANGE_INTERVAL || SECOND);
  setInterval(notify('all'), ON_PRODUCERS_INFO_CHANGE_INTERVAL || SECOND);

  process.on('message', ({ message, data }) => {
    if (message === 'setCurrentInfo') {
      setCurrentInfo(data);
    }
  });
};

initProducerHandler();
