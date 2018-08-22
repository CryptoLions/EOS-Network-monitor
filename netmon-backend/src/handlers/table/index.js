/* eslint-disable no-mixed-operators,no-continue,no-await-in-loop */
const {
  PRODUCERS_CHECK_INTERVAL,
  GET_INFO_INTERVAL,
  GET_INFO_TOP21_INTERVAL,
  TIMESTAMP_EPOCH,
  SAVE_TABLE_INTERVAL,
  LISTENERS: { ON_PRODUCERS_INFO_CHANGE_INTERVAL },
} = require('config');

const { ProducerModelV2, StateModelV2 } = require('../../db');

const { createEosApi, eosApi, castToInt, createLogger } = require('../../helpers');
const { SERVER_NOT_FOUND, CHECK_URLS, CONNECTION_REFUSED_BY_SERVER } = require('../../constants');
const createStorage = require('./storage');

const { info: logInfo, error: logError } = createLogger();

const saveTable = storage => async () => {
  const table = storage.getAll();
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

const getProducersInfo = async () => {
  const { total_producer_vote_weight } = await eosApi.getProducers({ json: true, limit: 1 });
  const onePercent = castToInt(total_producer_vote_weight) / 100;
  const producersFromDb = await ProducerModelV2.find({ total_votes: { $ne: null } })
    .sort({ total_votes: -1 })
    .exec();
  return producersFromDb.map(p => ({
    url: p.url,
    location: p.location,
    produced: p.produced,
    tx_count: p.tx_count,
    name: p.name,
    isNode: p.nodes && p.nodes.length,
    nodes: p.nodes,
    producer_key: p.producer_key,
    specialNodeEndpoint: p.specialNodeEndpoint,
    total_votes: p.total_votes,
    votesPercentage: p.total_votes / onePercent,
    votesInEOS: calculateEosFromVotes(p.total_votes),
    rewards_per_day: p.rewards_per_day,
    lastGoodAnsweredTime: p.lastGoodAnsweredTime,
    isSiteAvailable: p.isSiteAvailable,
    missedBlocks: p.missedBlocks,
  }));
};

const processNodeAndGetInfo = async (host, port, name, nodeId, wasEnabled) => {
  const localEosApi = createEosApi({ host, port });
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
  } catch ({ message }) {
    if (
      message.indexOf(CONNECTION_REFUSED_BY_SERVER) > 0
      || message.indexOf(SERVER_NOT_FOUND) > 0
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
    },
    producer: {
      name: info.head_block_producer,
      isNodeBroken: false,
      producedBlock: info.head_block_num,
      producedTimestamp: Date.parse(info.head_block_time),
      isNode: true,
      isUpdated: true,
    },
  };
};
const sort = rows => {
  const result = [...rows].filter(e => e.totalVotes);
  result.sort((a, b) => castToInt(b.totalVotes) - a.totalVotes);
  return result;
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
  const tableOnUpdateListeners = [];
  const orderOnChangeListeners = [];
  const storage = createStorage();
  const serialNumber = {
    top: 0,
    other: 0,
  };

  const previousProducersOrder = [];
  const setCurrentInfo = ({ info }) => {
    storage.updateGeneralInfo(info);
  };

  const notify = () => {
    const updated = storage.getUpdated();
    if (updated.length < 1) {
      return;
    }
    tableOnUpdateListeners.forEach(listener => {
      listener(updated);
    });
  };

  const checkProducers = async () => {
    try {
      const producers = await getProducersInfo();
      const nextProducersOrder = producers.map(p => p.name);
      storage.updateProducers(producers);
      const orderIsChanged = nextProducersOrder.find((e, i) => e !== previousProducersOrder[i]);
      if (orderIsChanged) {
        previousProducersOrder.length = 0;
        previousProducersOrder.push(...nextProducersOrder);
        orderOnChangeListeners.forEach(listener => {
          listener();
        });
      }
    } catch (e) {
      logInfo('Data about producers not received');
      logError(e);
    }
  };

  const checkInfo = producersType => async () => {
    const allProducers = storage.getAll();
    const slicedProducers = producersType === 'top' ? allProducers.slice(0, 21) : allProducers.slice(21);
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
  };

  await restoreTable(storage);

  setInterval(checkProducers, PRODUCERS_CHECK_INTERVAL);
  setInterval(checkInfo('other'), GET_INFO_INTERVAL);
  setInterval(checkInfo('top'), GET_INFO_TOP21_INTERVAL);
  setInterval(saveTable(storage), SAVE_TABLE_INTERVAL);

  if (ON_PRODUCERS_INFO_CHANGE_INTERVAL !== 0) {
    setInterval(notify, ON_PRODUCERS_INFO_CHANGE_INTERVAL);
  }

  return {
    onUpdate(listener) {
      tableOnUpdateListeners.push(listener);
    },
    onOrderChange(listener) {
      orderOnChangeListeners.push(listener);
    },
    setCurrentInfo,
    getAll() {
      return sort(storage.getAll());
    },
  };
};

module.exports = initProducerHandler;
