/* eslint-disable no-mixed-operators,no-continue,no-await-in-loop */
const {
  PRODUCERS_CHECK_INTERVAL,
  GET_INFO_INTERVAL,
  GET_INFO_TOP21_INTERVAL,
  TIMESTAMP_EPOCH,
  LISTENERS: { ON_PRODUCERS_INFO_CHANGE_INTERVAL },
} = require('config');

const { ProducerModelV2 } = require('../../db');

const { createEosApi, castToInt } = require('../../helpers');
const createStorage = require('./storage');

const CONNECTION_REFUSED_BE_SERVER = 'ECONNREFUSED';
const NODE_ENDPOINT_TYPES = ['https', 'http'];

const eosApi = createEosApi();

const calculateEosFromVotes = (votes) => {
  const date = Date.now() / 1000 - TIMESTAMP_EPOCH;
  const weight = parseInt(date / (86400 * 7), 10) / 52; // 86400 = seconds per day 24*3600
  return castToInt(votes) / (2 ** weight) / 10000;
};

const getProducersInfo = async () => {
  const { total_producer_vote_weight } = await eosApi.getProducers({ json: true, limit: 1 });
  const onePercent = castToInt(total_producer_vote_weight) / 100;
  const producersFromDb = await ProducerModelV2
    .find({ total_votes: { $ne: null } })
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
    total_votes: p.total_votes,
    votesPercentage: p.total_votes / onePercent,
    votesInEOS: calculateEosFromVotes(p.total_votes),
  }));
};

const processNodeAndGetInfo = async (host, port, name, nodeId, wasEnabled) => {
  const localEosApi = createEosApi({ host, port });
  const startTs = Date.now();
  let info;
  try {
    info = await localEosApi.getInfo({});
    if (!wasEnabled) {
      ProducerModelV2.updateOne(
        { name, 'nodes._id': nodeId },
        {
          $set: { 'nodes.$.enabled': true },
          $push: { 'nodes.$.downtimes': { to: new Date() } },
        },
      ).exec();
    }
  } catch ({ message }) {
    if (message.indexOf(CONNECTION_REFUSED_BE_SERVER) > 0) {
      if (!wasEnabled) {
        return { checked: { name, isNodeBroken: true, requestTS: startTs } };
      }
      ProducerModelV2.updateOne(
        { name, 'nodes._id': nodeId },
        {
          $set: { 'nodes.$.enabled': false },
          $push: { 'nodes.$.downtimes': { from: new Date() } },
        },
      ).exec();
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
  const answeredTimestamp = nowTs;
  const version = info.server_version;
  return {
    head_block_num: info.head_block_num,
    checked: {
      name,
      ping,
      answeredTimestamp,
      isNodeBroken: false,
      isCurrentNode: false,
      version,
      answeredBlock: info.head_block_num,
      isNode: true,
      requestTS: startTs,
      isUpdated: true,
      isUnsynced: false,
    },
    producer: {
      name: info.head_block_producer,
      isCurrentNode: true,
      isNodeBroken: false,
      producedBlock: info.head_block_num,
      producedTimestamp: nowTs,
      isNode: true,
      isUpdated: true,
    },
  };
};
const sort = (rows) => {
  const result = [...rows].filter(e => e.totalVotes);
  result.sort((a, b) => castToInt(b.totalVotes) - (a.totalVotes));
  return result;
};

const initProducerHandler = async () => {
  const listeners = [];
  const storage = createStorage();
  let checkedProducerNumber = 0;
  let topCheckedProducerNumber = 0;

  const notify = () => {
    const updated = storage.getUpdated();
    if (updated.length < 1) {
      return;
    }
    listeners.forEach(listener => {
      listener(updated);
    });
  };

  const checkProducers = async () => {
    storage.updateProducers(await getProducersInfo());
  };
  const checkInfo = async () => {
    const producers = await storage
      .getAll()
      .slice(21)
      .filter(e => e.isNode);
    if (producers.length < 1) {
      return;
    }
    if (producers.length <= checkedProducerNumber) {
      checkedProducerNumber = 1;
    } else {
      checkedProducerNumber += 1;
    }
    const { nodes } = producers[checkedProducerNumber - 1];
    const nodesInfo = await Promise.all(nodes.map(async node => {
      const {
        _id,
        http_server_address = '',
        https_server_address = '',
        p2p_server_address = '',
        bp_name,
        enabled,
      } = node;
      let httpsInfo = null;
      let httpInfo = null;
      for (let i = 0; i < NODE_ENDPOINT_TYPES.length; i += 1) {
        const type = NODE_ENDPOINT_TYPES[i];
        if (type === 'https') {
          if (https_server_address.length < 1) {
            continue;
          }
          const [host, port] = https_server_address.split(':');
          httpsInfo = await processNodeAndGetInfo(`https://${host}`, port, bp_name, _id, enabled);
          if (httpsInfo && httpsInfo.checked.version) {
            break;
          }
        } else if (type === 'http') {
          const [host, port] = http_server_address.split(':');
          if (host !== '0.0.0.0' && host !== '') {
            httpInfo = await processNodeAndGetInfo(`http://${host}`, port, bp_name, _id, enabled);
          }
          const [p2phost] = p2p_server_address.split(':');
          httpInfo = await processNodeAndGetInfo(`http://${p2phost}`, port, bp_name, _id, enabled);
        }
      }
      if (httpsInfo && httpsInfo.checked.version) {
        return httpsInfo;
      }
      if (httpInfo && httpInfo.checked.version) {
        return httpInfo;
      }
      if (httpsInfo && httpsInfo.checked.name) {
        return httpsInfo;
      }
      return httpInfo;
    }));
    const info = nodesInfo.find(e => !e.checked.isNodeBroken) || nodesInfo[0];
    storage.updateInfo(info);
  };
  const checkTopInfo = async () => {
    const producers = await storage.getAll().slice(0, 21);
    if (producers.length < 1) {
      return;
    }
    if (producers.length <= topCheckedProducerNumber) {
      topCheckedProducerNumber = 1;
    } else {
      topCheckedProducerNumber += 1;
    }
    const { nodes } = producers[topCheckedProducerNumber - 1];
    if (!nodes || nodes.length < 1) {
      if (producers.length === topCheckedProducerNumber) {
        topCheckedProducerNumber = 0;
      } else {
        topCheckedProducerNumber += 1;
      }
      return;
    }
    const nodesInfo = await Promise.all(nodes.map(async node => {
      const {
        _id,
        http_server_address = '',
        https_server_address = '',
        p2p_server_address = '',
        bp_name,
        enabled,
      } = node;
      let httpsInfo = null;
      let httpInfo = null;
      for (let i = 0; i < NODE_ENDPOINT_TYPES.length; i += 1) {
        const type = NODE_ENDPOINT_TYPES[i];
        if (type === 'https') {
          if (https_server_address.length < 1) {
            continue;
          }
          const [host, port] = https_server_address.split(':');
          httpsInfo = await processNodeAndGetInfo(`https://${host}`, port, bp_name, _id, enabled);
          if (httpsInfo && httpsInfo.checked.version) {
            break;
          }
        } else if (type === 'http') {
          const [host, port] = http_server_address.split(':');
          if (host !== '0.0.0.0' && host !== '') {
            httpInfo = await processNodeAndGetInfo(`http://${host}`, port, bp_name, _id, enabled);
          }
          const [p2phost] = p2p_server_address.split(':');
          httpInfo = await processNodeAndGetInfo(`http://${p2phost}`, port, bp_name, _id, enabled);
        }
      }
      if (httpsInfo && httpsInfo.checked.version) {
        return httpsInfo;
      }
      if (httpInfo && httpInfo.checked.version) {
        return httpInfo;
      }
      if (httpsInfo && httpsInfo.checked.name) {
        return httpsInfo;
      }
      return httpInfo;
    }));
    const info = nodesInfo.find(e => !e.checked.isNodeBroken) || nodesInfo[0];
    storage.updateInfo(info);
  };
  setInterval(checkProducers, PRODUCERS_CHECK_INTERVAL);
  setInterval(checkInfo, GET_INFO_INTERVAL);
  setInterval(checkTopInfo, GET_INFO_TOP21_INTERVAL);
  if (ON_PRODUCERS_INFO_CHANGE_INTERVAL !== 0) {
    setInterval(notify, ON_PRODUCERS_INFO_CHANGE_INTERVAL);
  }

  return {
    onUpdate(listener) {
      listeners.push(listener);
    },
    getAll() {
      return sort(storage.getAll());
    },
  };
};

module.exports = initProducerHandler;
