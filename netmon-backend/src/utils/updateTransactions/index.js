/* eslint-disable no-param-reassign */
const { UPDATE_TRANSACTIONS: { FROM_BLOCK_NUM, TO_BLOCK_NUM }, BLOCK_CHECK_INTERVAL } = require('config');
const { createEosApi } = require('../../helpers');
const {
  connect,
  TransactionModelV2,
  StateModelV2,
} = require('../../db');
const extractData = require('../../routines/handleBlock/extractData');

const eosApi = createEosApi();

const saveBlockData = async (transactions) => {
  if (transactions.length < 1) {
    return;
  }
  const transactionsInfo = transactions
    .map(({ txInfo }) => txInfo);
  TransactionModelV2.insertMany(transactionsInfo);

  const bulkWriteAccountOptions = transactions
    .map(({ txInfo }) => {
      const options = {
        updateOne: {
          filter: { txid: txInfo.txid },
          update: { $set: txInfo },
          upsert: true,
        },
      };
      return options;
    })
    .filter(e => e);
  if (bulkWriteAccountOptions.length > 0) {
    TransactionModelV2.bulkWrite(bulkWriteAccountOptions);
  }
};

const getActionsCount = (block) => {
  if (block.transactions.length < 1) {
    return 0;
  }
  return block.transactions.reduce(
    (result, transaction) => result + (transaction.trx.transaction ? transaction.trx.transaction.actions.length : 0),
    0,
  );
};

const findMaxInfo = ({ current = { transactions: [] }, previous = {}, max_tps = 0, max_aps = 0 }) => {
  const live_tps = current.transactions.length + (previous.transactions
    ? previous.transactions.length
    : 0);
  const live_aps = getActionsCount(current) + (previous.transactions
    ? getActionsCount(previous)
    : 0);

  const res = {};
  if (live_tps > max_tps) {
    res.max_tps = live_tps;
    res.max_tps_block = current.block_num;
  }
  if (live_aps > max_aps) {
    res.max_aps = live_aps;
  }
  if (res.max_aps || res.max_tps) {
    return res;
  }
  return undefined;
};

const startHandleBlock = async () => {
  await connect();
  const state = await StateModelV2.findOne({ id: 1 });
  if (!state) {
    console.log('Collection "State" is empty!');
    return;
  }
  let previous = {};
  const handleBlock = async () => {
    try {
      const { utils: { updateTransactions: { lastCheckedBlock } }, max_aps, max_tps } =
        await StateModelV2.findOne({ id: 1 });
      if (lastCheckedBlock > TO_BLOCK_NUM) {
        console.log('Transactions updating has already done!' +
          ' The last handled block is greater than TO_BLOCK_NUM.' +
          ' Stop the script! Or check config and State table!');
        return;
      }
      if (lastCheckedBlock < FROM_BLOCK_NUM) {
        console.log('The last handled block is less than FROM_BLOCK_NUM.! Check config and State table!');
        return;
      }
      await StateModelV2.update(
        { id: 1 },
        { $inc: { 'utils.updateTransactions.lastCheckedBlock': 1 } },
      );
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

startHandleBlock();
