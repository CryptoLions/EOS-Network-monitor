/* eslint-disable no-param-reassign */
const {
  UPDATE_TRANSACTIONS: { FROM_BLOCK_NUM, TO_BLOCK_NUM, DEFAULT_VALUE },
} = require('config');
const { eosApi, createLogger } = require('../../helpers');
const { StateModelV2 } = require('../../db');
const extractData = require('../../routines/handleBlock/extractData');
const findMaxInfo = require('../../routines/handleBlock/findMaxInfo');
const saveBlockData = require('../../routines/handleBlock/saveBlockData');
const { SECOND } = require('../../constants');

const { info: logInfo } = createLogger();

const startHandleBlock = async () => {
  const stateData = await StateModelV2.findOne({ id: 1 }).select('utils');
  if (!stateData) {
    logInfo('Collection "State" is empty!');
    return;
  }
  logInfo('Resyncing has been started');
  let previous = {};
  const handleBlock = async () => {
    try {
      const startTs = Date.now();
      const state = await StateModelV2.findOne({ id: 1 }).select('utils');
      const { max_aps, max_tps } = state;
      let {
        utils: {
          updateTransactions: { lastCheckedBlock },
        },
      } = state;
      if (lastCheckedBlock === DEFAULT_VALUE || lastCheckedBlock < FROM_BLOCK_NUM) {
        await StateModelV2.update({ id: 1 }, { $set: { 'utils.updateTransactions.lastCheckedBlock': FROM_BLOCK_NUM } });
        lastCheckedBlock = FROM_BLOCK_NUM;
      }
      if (lastCheckedBlock > TO_BLOCK_NUM) {
        logInfo(
          'Transactions updating has already done!' +
            ' The last handled block is greater than TO_BLOCK_NUM.' +
            ' Stop the script! Or check config and State table!',
        );
        return;
      }
      await StateModelV2.update({ id: 1 }, { $inc: { 'utils.updateTransactions.lastCheckedBlock': 1 } });
      const block = await eosApi.getBlock(lastCheckedBlock + 1);
      const max = findMaxInfo({ current: block, previous, max_aps, max_tps });
      block.producedInSeconds = (Date.parse(block.timestamp) - Date.parse(previous.timestamp)) / SECOND;
      previous = block;
      if (max) {
        StateModelV2.update({ id: 1 }, { $set: max }).exec();
      }
      const data = await extractData(block);
      await saveBlockData({ transactions: data, producer: block.producer });
      logInfo(`Block ${lastCheckedBlock + 1} was resynced. Time: ${Date.now() - startTs}`);
      handleBlock();
    } catch (e) {
      await StateModelV2.update({ id: 1 }, { $inc: { 'utils.updateTransactions.lastCheckedBlock': -1 } });
      logInfo('resync ERROR');
      logInfo(e);
      handleBlock();
    }
  };
  handleBlock();
};

module.exports = startHandleBlock;
