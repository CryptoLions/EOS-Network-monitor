/* eslint-disable no-param-reassign */
const { START_BLOCKS_HANDLING_FROM } = require('config');
const { createEosApi } = require('../../helpers');
const {
  TransactionModelV2,
  StateModelV2,
  AccountModelV2,
  ProducerModelV2,
  TransactionToAccountV2,
} = require('../../db');
const extractData = require('./extractData');

const eosApi = createEosApi();

const saveBlockData = async transactions => {
  if (!transactions || !transactions.length) {
    return;
  }

  // update total_txblocks_count
  await StateModelV2.update({ id: 1 }, { $inc: { total_txblocks_count: 1 } }).exec();

  // collect data
  const transactionsInfo = [];
  const accountsToInsert = [];
  const transactionToAccountInfo = [];
  const producersData = {};

  transactions.forEach(({ txInfo, newAccount, accounts, blocknum, producer }) => {
    // Update Transactions collection
    transactionsInfo.push(txInfo);

    // Update Accounts collection
    if (newAccount) {
      accountsToInsert.push({
        updateOne: {
          filter: { name: newAccount.name },
          update: newAccount,
          upsert: true,
        },
      });

      transactionToAccountInfo.push({ txid: txInfo.txid, account: newAccount.name });
    }

    // Update TransactionToAccount collection
    accounts.forEach(name => {
      transactionToAccountInfo.push({ txid: txInfo.txid, account: name });
    });

    // Update Producers collection
    if (!producersData[blocknum]) {
      producersData[blocknum] = {
        name: producer,
        tx_count: 1,
      };
    } else {
      producersData[blocknum].tx_count += 1;
    }
  });

  if (transactionsInfo.length) {
    await TransactionModelV2.insertMany(transactionsInfo);
  }

  if (accountsToInsert.length) {
    await AccountModelV2.bulkWrite(accountsToInsert);
  }

  if (transactionToAccountInfo.length) {
    try {
      await TransactionToAccountV2.insertMany(transactionToAccountInfo);
    } catch (e) {}
  }

  const bulkWriteProducersOptions = Object.values(producersData).map(({ name, tx_count }) => ({
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

const getActionsCount = block => {
  if (block.transactions.length < 1) {
    return 0;
  }
  return block.transactions.reduce(
    (result, transaction) => result + (transaction.trx.transaction ? transaction.trx.transaction.actions.length : 0),
    0,
  );
};

const findMaxInfo = ({ current = { transactions: [] }, previous = {}, max_tps = 0, max_aps = 0 }) => {
  const live_tps = current.transactions.length + (previous.transactions ? previous.transactions.length : 0);
  const live_aps = getActionsCount(current) + (previous.transactions ? getActionsCount(previous) : 0);

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

let previous = {};
const handleBlock = async () => {
  try {
    const { lastHandledBlock, max_tps, max_aps } = await StateModelV2.findOne({ id: 1 });
    console.time(`handleBlock ${lastHandledBlock}`);

    const block = await eosApi.getBlock(lastHandledBlock + 1);
    const max = findMaxInfo({ current: block, previous, max_aps, max_tps });
    previous = block;
    if (max) {
      await StateModelV2.update({ id: 1 }, { $set: max }).exec();
    }
    await ProducerModelV2.update(
      { name: block.producer },
      { $inc: { produced: 1, tx_count: block.transactions.length } },
    ).exec();
    // const data = await extractData(block);
    // await saveBlockData(data);
    console.timeEnd(`handleBlock ${lastHandledBlock}`);

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
