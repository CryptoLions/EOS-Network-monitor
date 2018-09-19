/* eslint-disable no-param-reassign */
const { eosApi, createLogger } = require('../../helpers');
const { StateModelV2, ProducerModelV2 } = require('../../db');
const processMissedBlocks = require('./processMissedBlocks');

const { info: logInfo } = createLogger();

const saveData = async (block) => {
  await ProducerModelV2.updateOne(
    { name: block.producer },
    { $inc: { 'checkedData2.tx_count': block.transactions.length, 'checkedData2.produced': 1 } },
    { upsert: true },
  ).exec();
  await StateModelV2
    .update(
      { id: 1 },
      { $inc: {
        'checkedData2.total_txblocks_count': block.transactions.length ? 1 : 0,
        'checkedData2.totalTransactionsCount': block.transactions.length,
        'checkedData2.producedBlocks': 1,
      } },
    )
    .exec();
};

let previous = {};
const handleBlock = async () => {
  try {
    const startTs = Date.now();
    const state =
      await StateModelV2.findOne({ id: 1 }).select('utils');
    if (!state) {
      logInfo('Collection "State" is empty!');
      return;
    }
    const { utils: { checkProducedBlocks: { lastCheckedBlock, endBlock } } } = state;
    if (lastCheckedBlock >= endBlock) {
      logInfo('Checking produced blocks finished!');
      return;
    }
    const block = await eosApi.getBlock(lastCheckedBlock + 1);
    await processMissedBlocks({ current: block, previous });
    previous = { ...block };
    await saveData(block);

    await StateModelV2.update({ id: 1 }, { $inc: { 'utils.checkProducedBlocks.lastCheckedBlock': 1 } });
    logInfo(`Block ${lastCheckedBlock + 1} was checked. Time: ${Date.now() - startTs}ms`);
    handleBlock();
  } catch (e) {
    logInfo('Checking produced blocks error');
    logInfo(e);
    setTimeout(handleBlock, 500);
    // change the work node
  }
};

module.exports = handleBlock;
