/* eslint-disable no-param-reassign */
const { START_BLOCKS_HANDLING_FROM } = require('config');
const { eosApi, createLogger } = require('../../helpers');
const {
  StateModelV2,
  ProducerModelV2,
} = require('../../db');
const extractData = require('./extractData');
const findMaxInfo = require('./findMaxInfo');
const saveBlockData = require('./saveBlockData');
const processMissedBlocks = require('./processMissedBlocks');
const { SECOND } = require('../../constants');

const { info: logInfo } = createLogger();

let previous = {};
const handleBlock = async () => {
  try {
    const { lastHandledBlock, max_tps, max_aps, checkedData } =
      await StateModelV2.findOne({ id: 1 }).select('lastHandledBlock max_tps max_aps checkedData');
    const timeMark = Date.now();
    if (!checkedData.startFromBlock) {
      await StateModelV2.updateOne({ id: 1 }, { 'checkedData.startFromBlock': lastHandledBlock + 1 }).exec();
    }
    const { last_irreversible_block_num } = await eosApi.getInfo();
    if (last_irreversible_block_num <= lastHandledBlock) {
      setTimeout(handleBlock, 500);
      return;
    }
    const block = await eosApi.getBlock(lastHandledBlock + 1);
    processMissedBlocks({ current: block, previous });
    const max = await findMaxInfo({ current: block, previous, max_aps, max_tps });
    block.producedInSeconds = (Date.parse(block.timestamp) - Date.parse(previous.timestamp)) / SECOND;
    previous = block;
    if (max) {
      await StateModelV2.update({ id: 1 }, { $set: max }).exec();
    }
    await ProducerModelV2.update(
      { name: block.producer },
      { $inc: { produced: 1, tx_count: block.transactions.length } },
    ).exec();

    const data = await extractData(block);
    await saveBlockData(data);
    logInfo(`handleBlock ${lastHandledBlock} ${Date.now() - timeMark} ms`);

    await StateModelV2.update({ id: 1 }, { $inc: { lastHandledBlock: 1 } });
    handleBlock();
  } catch (e) {
    if (e.status === 500 && e.statusText === 'Internal Server Error') {
      // Block is not produced yet
    }

    setTimeout(handleBlock, 500);
    // change the work node
  }
};

const startHandleBlock = async () => {
  const state = await StateModelV2.findOne({ id: 1 });
  if (!state) {
    await new StateModelV2({
      id: 1,
      lastHandledBlock: START_BLOCKS_HANDLING_FROM || (await eosApi.getInfo({})).head_block_num,
    }).save();
  }

  handleBlock();
};

module.exports = startHandleBlock;
