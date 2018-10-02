/* eslint-disable no-param-reassign */
const {
  BLACK_PRODUCERS_LIST,
  ALLOWABLE_NON_SYNCHRONIZED_DIFFERENCE_IN_BLOCKS,
} = require('config');
const differenceBy = require('lodash/differenceBy');
const { castToInt, pickAs } = require('../../helpers');

const sort = rows => {
  const result = [...rows].filter(e => e.totalVotes);
  result.sort((a, b) => castToInt(b.totalVotes) - a.totalVotes);
  return result;
};

const createStorage = () => {
  let updated = {};
  let storage = [];
  let lastGoodBlockNumber = 0;

  const updateNodeInfo = ({ checked, head_block_num }) => {
    if (head_block_num && head_block_num > lastGoodBlockNumber) {
      lastGoodBlockNumber = head_block_num; // good
    } else if (
      head_block_num &&
      head_block_num + ALLOWABLE_NON_SYNCHRONIZED_DIFFERENCE_IN_BLOCKS < lastGoodBlockNumber
    ) {
      // the checked node is unsynced
      checked = {
        ...checked,
        isUnsynced: true,
      };
    } else if (head_block_num) {
      // data is old because the checked node ping is very big
      checked = pickAs(checked, [
        'ping',
        'name',
        'isNode',
        'isNodeBroken',
        'requestTS',
        'version',
        'answeredBlock',
        'isUnsynced',
        'responseIsBad',
        'errorMessage',
        'statusCode',
      ]);
    }

    lastGoodBlockNumber = head_block_num;
    Object.assign(checked, { answeredTimestamp: Date.now() });
    const checkedIndex = storage.findIndex(e => checked.name === e.name);
    if (checkedIndex !== -1) {
      storage[checkedIndex] = {
        ...storage[checkedIndex],
        ...checked,
      };
      updated[checked.name] = {
        ...storage[checkedIndex],
      };
    }
  };
  const updateMissedProducing = (top21) => {
    storage = storage
      .map(e => {
        const found = top21.find(p => p.name === e.name);
        return found ? { ...e, ...found } : e;
      });
  };

  const updateProducers = (producers) => {
    const transformedProducers = producers
      .map(p => pickAs(p, [
        'name',
        'produced',
        'tx_count',
        'votesPercentage',
        'votesInEOS',
        'isNode',
        'nodes',
        'specialNodeEndpoint',
        'rewards_per_day',
        'lastGoodAnsweredTime',
        'isSiteAvailable',
        'missedBlocks',
        'missedBlocksForDay',
        'missedBlocksForRound',
        'missedBlocksTotal',
        'checkedData2',
        'endpoints',
        'expectedIncomeData',
        {
          totalVotes: 'total_votes',
          organizationUrl: 'url',
          key: 'producer_key',
        },
      ]))
      .filter(p => !BLACK_PRODUCERS_LIST.find(b => b.key === p.key));
    if (storage.length === 0) {
      storage.push(...transformedProducers.map(e => ({ ...e, isUpdated: true })));
      return;
    }
    storage = storage
      .map(e => {
        const found = transformedProducers.find(p => p.name === e.name);
        return found ? { ...e, ...found } : e;
      })
      .concat(differenceBy(transformedProducers, storage, 'name'));

    // delete old
    storage = storage
      .filter(e => producers.find(p => p.name === e.name));

    storage = sort(storage);

    updated = storage
      .map(e => {
        const found = transformedProducers.find(
          p =>
            p.name === e.name &&
            (p.totalVotes !== e.totalVotes ||
              p.organizationUrl !== e.organizationUrl ||
              p.key !== e.key ||
              p.produced !== e.produced ||
              p.rewards_per_day !== e.rewards_per_day ||
              p.tx_count !== e.tx_count),
        );
        return found ? { ...e, ...found, isUpdated: true } : e;
      })
      .filter(e => e.isUpdated)
      .reduce(
        (res, e) => ({
          ...res,
          [e.name]: { ...e },
        }),
        updated,
      );
  };

  const updateGeneralInfo = (info) => {
    const previousProducerIndex = storage.findIndex(e => e.isCurrentNode);
    if (previousProducerIndex !== -1 && storage[previousProducerIndex].name !== info.head_block_producer) {
      storage[previousProducerIndex] = {
        ...storage[previousProducerIndex],
        isCurrentNode: false,
        isUpdated: true,
      };
      updated[storage[previousProducerIndex].name] = {
        ...storage[previousProducerIndex],
      };
    }
    storage = storage.map(e => ({ ...e, isCurrentNode: false, isUpdated: e.isCurrentNode }));
    const producerIndex = storage.findIndex(e => info.head_block_producer === e.name);
    if (producerIndex !== -1) {
      storage[producerIndex] = {
        ...storage[producerIndex],
        isCurrentNode: true,
        isNode: true,
        isUpdated: true,
        producedBlock: info.head_block_num,
        producedTimestamp: Date.parse(info.head_block_time),
      };
      updated[info.head_block_producer] = {
        ...storage[producerIndex],
      };
    }
  };

  const getAll = () => storage;
  const getUpdated = () => {
    storage = storage.map(e => ({ ...e, isUpdated: false }));
    const result = Object.values(updated);
    updated = {};
    return result;
  };
  const replaceAll = table => {
    storage = table;
  };

  return {
    updateNodeInfo,
    updateMissedProducing,
    updateProducers,
    updateGeneralInfo,
    replaceAll,
    getAll,
    getUpdated,
  };
};

module.exports = createStorage;
