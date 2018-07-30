/* eslint-disable no-param-reassign */
const { BLACK_PRODUCERS_LIST, ALLOWABLE_NON_SYNCHRONIZED_DIFFERENCE_IN_BLOCKS } = require('config');
const differenceBy = require('lodash/differenceBy');
const pick = require('lodash/pick');

const createStorage = () => {
  let updated = {};
  let storage = [];
  let lastGoodBlockNumber = 0;

  return {
    updateInfo({ checked, producer, head_block_num }) {
      let updateProducer = false;
      if (head_block_num && head_block_num > lastGoodBlockNumber) {
        lastGoodBlockNumber = head_block_num; // good
        updateProducer = true;
      } else if (
        head_block_num &&
        head_block_num + ALLOWABLE_NON_SYNCHRONIZED_DIFFERENCE_IN_BLOCKS < lastGoodBlockNumber
      ) {
        // the checked node is unsynced
        checked = pick(checked, ['ping', 'name', 'isNode', 'isNodeBroken', 'requestTS']);
      } else if (head_block_num) {
        // data is old because the checked node ping is very big
        checked = pick(
          checked,
          ['ping', 'name', 'isNode', 'isNodeBroken', 'requestTS', 'version', 'answeredBlock', 'answeredTimestamp'],
        );
      }

      lastGoodBlockNumber = head_block_num;
      if (updateProducer) {
        const previousProducerIndex = storage.findIndex(e => e.isCurrentNode);
        if (previousProducerIndex !== -1 && storage[previousProducerIndex].name !== producer.name) {
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
        const producerIndex = storage.findIndex(e => producer.name === e.name);
        if (producerIndex !== -1) {
          storage[producerIndex] = {
            ...storage[producerIndex],
            ...producer,
          };
          updated[producer.name] = {
            ...storage[producerIndex],
          };
        }
      }
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
    },
    updateProducers(producers) {
      const transformedProducers = producers
        .map(p => ({
          name: p.name,
          totalVotes: p.total_votes,
          organizationUrl: p.url,
          key: p.producer_key,
          produced: p.produced,
          tx_count: p.tx_count,
          votesPercentage: p.votesPercentage,
          votesInEOS: p.votesInEOS,
          isNode: p.isNode,
          nodes: p.nodes,
        }))
        .filter(p => !BLACK_PRODUCERS_LIST.find(b => b.key === p.key));
      if (storage.length === 0) {
        storage.push(...transformedProducers.map(e => ({ ...e, isUpdated: true })));
        return;
      }
      storage = storage
        .map(e => {
          const found = transformedProducers
            .find(p => (p.name === e.name)
              && (
                p.totalVotes !== e.totalVotes
                || p.organizationUrl !== e.organizationUrl
                || p.key !== e.key
                || p.produced !== e.produced
                || p.tx_count !== e.tx_count
              ));
          return found ? { ...e, ...found, isUpdated: true } : e;
        })
        .concat(differenceBy(transformedProducers, storage, 'name'));

      updated = storage
        .filter(e => e.isUpdated)
        .reduce((res, e) => ({
          ...res,
          [e.name]: { ...e },
        }), updated);
    },
    getAll() {
      return storage;
    },
    getUpdated() {
      storage = storage.map(e => ({ ...e, isUpdated: false }));
      const res = Object.values(updated);
      updated = {};
      return res;
    },
  };
};

module.exports = createStorage;
