/* eslint-disable no-param-reassign */
const { eosApi, createLogger } = require('../../helpers');
const { StateModelV2, ProducerModelV2 } = require('../../db');

const { info: logInfo } = createLogger();

const updateProducer = async (block) =>
  ProducerModelV2.updateOne(
    { name: block.producer },
    { $inc: { 'checkedData.tx_count': block.transactions.length, 'checkedData.produced': 1 } },
  ).exec();

const handleBlock = async (done) => {
  try {
    const state =
      await StateModelV2.findOne({ id: 1 }).select('utils');
    if (!state) {
      logInfo('Collection "State" is empty!');
      done();
      return;
    }
    const { utils: { checkProducedBlocks: { lastCheckedBlock, endBlock } } } = state;
    if (lastCheckedBlock >= endBlock) {
      console.log('Checking produced blocks finished!')
      logInfo('Checking produced blocks finished!');
      return;
    }
    const block = await eosApi.getBlock(lastCheckedBlock + 1);
    await updateProducer(block);

    await StateModelV2.update({ id: 1 }, { $inc: { 'utils.checkProducedBlocks.lastCheckedBlock': 1 } });
    handleBlock(done);
  } catch (e) {
    logInfo('Checking produced blocks error', e);
    setTimeout(handleBlock, 500, done);
    // change the work node
  }
};

const start = async () => new Promise(handleBlock);

module.exports = start;
