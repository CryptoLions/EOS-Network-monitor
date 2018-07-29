/* eslint-disable no-param-reassign */
const { BLOCK_CHECK_INTERVAL, START_BLOCKS_HANDLING_FROM } = require('config');
const flatten = require('lodash/flatten');
const { createEosApi } = require('../../helpers');
const {
  TransactionModelV2,
  StateModelV2,
  AccountModelV2,
  ProducerModelV2,
} = require('../../db');
const extractData = require('./extractData');

const eosApi = createEosApi();

const saveBlockData = async (transactions) => {
  if (transactions.length < 1) {
    return;
  }
  StateModelV2.update({ id: 1 }, { $inc: { total_txblocks_count: 1 } }).exec();
  const transactionsInfo = transactions
    .map(({ txInfo }) => txInfo);
  TransactionModelV2.insertMany(transactionsInfo);

  const bulkWriteAccountOptions = transactions
    .map(({ newAccount, accounts, txInfo }) => {
      if (!newAccount && !accounts) {
        return undefined;
      }
      const options = accounts.map(name => ({
        updateOne: {
          filter: { name },
          update: { $set: { name }, $push: { mentionedIn: txInfo.txid } },
          upsert: true,
        },
      }));
      if (newAccount) {
        options.push({
          updateOne: {
            filter: { name: newAccount.name },
            update: newAccount,
            upsert: true,
          },
        });
      }
      return options;
    })
    .filter(e => e);
  if (bulkWriteAccountOptions.length > 0) {
    AccountModelV2.bulkWrite(flatten(bulkWriteAccountOptions));
  }
  const producersData = transactions.reduce((result, tx) => {
    if (!result[tx.blocknum]) {
      result[tx.blocknum] = {
        name: tx.producer,
        tx_count: 1,
      };
    } else {
      result[tx.blocknum].tx_count += 1;
    }
    return result;
  }, {});
  const bulkWriteProducersOptions = Object.values(producersData)
    .map(({ name, tx_count }) => ({
      updateOne: {
        filter: { name },
        update: { $inc: { tx_count, produced: 1 } },
        upsert: true,
      },
    }));
  if (bulkWriteProducersOptions.length > 0) {
    ProducerModelV2.bulkWrite(bulkWriteProducersOptions);
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
  const state = await StateModelV2.findOne({ id: 1 });
  if (!state) {
    await new StateModelV2({
      id: 1,
      lastHandledBlock: START_BLOCKS_HANDLING_FROM || (await eosApi.getInfo({})).head_block_num,
    }).save();
  }
  let previous = {};
  const handleBlock = async () => {
    try {
      const { lastHandledBlock, max_tps, max_aps } = await StateModelV2.findOne({ id: 1 });
      await StateModelV2.update({ id: 1 }, { $inc: { lastHandledBlock: 1 } });
      const block = await eosApi.getBlock(lastHandledBlock + 1);
      const max = findMaxInfo({ current: block, previous, max_aps, max_tps });
      previous = block;
      if (max) {
        StateModelV2.update({ id: 1 }, { $set: max }).exec();
      }
      ProducerModelV2.update(
        { name: block.producer },
        { $inc: { produced: 1, tx_count: block.transactions.length } },
      ).exec();
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
