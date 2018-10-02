const { LAST_BLOCKS_NUMBER_FOR_CALCULATING_AVG_APS_TPS } = require('config');
const getActionsCount = require('../../routines/handleBlock/getActionsCount');

const create = () => {
  const blockStorage = {
    max_tps: 0,
    max_tps_block: 0,
    max_aps_block: 0,
    max_aps: 0,
    previous: {},
    previous_live_tps: [], // its needed for calculating avg aps and tps
    previous_live_aps: [], // its needed for calculating avg aps and tps
    replacedNumber: 0, // its needed for calculating avg aps and tps
  };

  const avg = arr => {
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return (sum / arr.length).toFixed();
  };

  const composeData = ({ block, max_tps = 0, max_aps = 0, max_tps_block = 0, max_aps_block = 0 }) => {
    const block_tps =
      block.transactions.length + (blockStorage.previous.transactions ? blockStorage.previous.transactions.length : 0);
    const block_aps =
      getActionsCount(block) + (blockStorage.previous.transactions ? getActionsCount(blockStorage.previous) : 0);

    blockStorage.previous_live_aps[blockStorage.replacedNumber] = block_aps;
    blockStorage.previous_live_tps[blockStorage.replacedNumber] = block_tps;
    blockStorage.replacedNumber += 1;
    if (blockStorage.replacedNumber === LAST_BLOCKS_NUMBER_FOR_CALCULATING_AVG_APS_TPS) {
      blockStorage.replacedNumber = 0;
    }
    return {
      ...block,
      live_tps: avg(blockStorage.previous_live_tps),
      live_aps: avg(blockStorage.previous_live_aps),
      block_tps,
      block_aps,
      max_tps,
      max_aps,
      max_tps_block,
      max_aps_block,
    };
  };

  const updateStorage = ({ previous, previous_live_tps, previous_live_aps, replacedNumber }) => {
    blockStorage.previous = previous || blockStorage.previous;
    blockStorage.previous_live_tps = previous_live_tps || blockStorage.previous_live_tps;
    blockStorage.previous_live_aps = previous_live_aps || blockStorage.previous_live_aps;
    blockStorage.replacedNumber = replacedNumber || blockStorage.replacedNumber;
  };

  return {
    composeData,
    updateStorage,
  };
};

module.exports = create;
