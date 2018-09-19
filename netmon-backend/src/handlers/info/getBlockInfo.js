const { createEosApi } = require('../../helpers');

const eosApi = createEosApi();

const findNextProducer = (list, current) => {
  const currentIndex = list.indexOf(current);
  const nextIndex = currentIndex === list.length - 1 ? 0 : currentIndex + 1;
  return list[nextIndex];
};

let previous = {};
let blockNum = 0;

const getBlockInfo = async (schedule) => {
  const info = await eosApi.getInfo({});
  if (!blockNum) {
    blockNum = info.head_block_num;
  }
  info.next_producer = findNextProducer(schedule.active.producers.map(e => e.producer_name), info.head_block_producer);
  const number = info.head_block_num;
  let block;
  try {
    block = await eosApi.getBlock(blockNum);
    previous = block;
    blockNum += 1;
  } catch (e) {
    block = previous;
  }
  return {
    number,
    info,
    block,
  };
};

module.exports = getBlockInfo;
