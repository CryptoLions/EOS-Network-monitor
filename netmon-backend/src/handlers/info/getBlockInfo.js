const { createEosApi } = require('../../helpers');

const eosApi = createEosApi();

const findNextProducer = (list, current) => {
  const currentIndex = list.indexOf(current);
  const nextIndex = currentIndex === list.length - 1 ? 0 : currentIndex + 1;
  return list[nextIndex];
};

const getBlockInfo = async (blockNum) => {
  if (blockNum) {
    return eosApi.getBlock(blockNum);
  }
  const info = await eosApi.getInfo({});
  const schedule = await eosApi.getProducerSchedule({});
  info.next_producer = findNextProducer(schedule.active.producers.map(e => e.producer_name), info.head_block_producer);
  const number = info.head_block_num;
  const block = await eosApi.getBlock(number);
  return {
    number,
    info,
    block,
  };
};

module.exports = getBlockInfo;
