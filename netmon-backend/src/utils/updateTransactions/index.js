/* eslint-disable no-param-reassign */
const {
  UPDATE_TRANSACTIONS: { FROM_BLOCK_NUM, TO_BLOCK_NUM, DEFAULT_VALUE },
  BLOCK_CHECK_INTERVAL,
} = require('config');
const { eosApi, createLogger } = require('../../helpers');
const { StateModelV2 } = require('../../db');
const extractData = require('../../routines/handleBlock/extractData');
const findMaxInfo = require('../../routines/handleBlock/findMaxInfo');
const saveBlockData = require('../../routines/handleBlock/saveBlockData');

const { info: logInfo } = createLogger();

const startHandleBlock = async () => {
  const stateData = await StateModelV2.findOne({ id: 1 });
  let doWork = true;
  if (!stateData) {
    logInfo('Collection "State" is empty!');
    return;
  }
  let previous = {};
  const handleBlock = async () => {
    if (!doWork) {
      return;
    }
    try {
      const state = await StateModelV2.findOne({ id: 1 });
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
        doWork = false;
        return;
      }
      await StateModelV2.update({ id: 1 }, { $inc: { 'utils.updateTransactions.lastCheckedBlock': 1 } });
      const block = await eosApi.getBlock(lastCheckedBlock + 1);
      const max = findMaxInfo({ current: block, previous, max_aps, max_tps });
      previous = block;
      if (max) {
        StateModelV2.update({ id: 1 }, { $set: max }).exec();
      }
      const data = await extractData(block);
      await saveBlockData(data);
    } catch (e) {
      StateModelV2.update({ id: 1 }, { $inc: { lastHandledBlock: -1 } }).exec();
      if (e.status === 500 && e.statusText === 'Internal Server Error') {
        // Block is not produced yet
      }
      // change the work node
    }
  };
  setInterval(handleBlock, BLOCK_CHECK_INTERVAL);
};

module.exports = startHandleBlock;
