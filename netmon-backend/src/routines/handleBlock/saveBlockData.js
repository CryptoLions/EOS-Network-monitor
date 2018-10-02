const flatten = require('lodash/flatten');

const {
  TransactionModelV2,
  StateModelV2,
  AccountModelV2,
  ProducerModelV2,
  TransactionToAccountV2,
  TransactionLastHourModelV2,
} = require('../../db');
const { createLogger } = require('../../helpers');

const { error: logError } = createLogger();

const saveBlockData = async ({ transactions, producer }) => {
  if (!transactions || !transactions.length) {
    await StateModelV2.update(
      { id: 1 },
      { $inc: { 'checkedData2.producedBlocks': 1 } },
    ).exec();
    await ProducerModelV2.updateOne({ name: producer }, {
      $inc:
        {
          produced: 1,
          produced_per_day: 1,
          'checkedData.produced': 1,
          'checkedData2.produced': 1,
        },
    }).exec();
    return;
  }

  // update total_txblocks_count
  await StateModelV2
    .update(
      { id: 1 },
      { $inc: {
        total_txblocks_count: 1,
        produced_per_day: 1,
        totalTransactionsCount: transactions.length,
        'checkedData.total_txblocks_count': 1,
        'checkedData.totalTransactionsCount': transactions.length,
        'checkedData2.total_txblocks_count': 1,
        'checkedData2.totalTransactionsCount': transactions.length,
        'checkedData2.producedBlocks': 1,
      } },
    )
    .exec();

  // collect data
  const transactionsInfo = transactions.map(t => t.txInfo);
  const accountsToInsert = transactions
    .map(t => {
      if (t.newAccount && t.newAccount.name) {
        return {
          updateOne: {
            filter: { name: t.newAccount.name },
            update: t.newAccount,
            upsert: true,
          },
        };
      }
      return undefined;
    })
    .filter(a => a);
  const transactionToAccountInfo = flatten(transactions.map(t => (t.newAccount && t.newAccount.name
    ? t.accounts
      .map(a => ({ txid: t.txInfo.txid, account: a, block: t.txInfo.block }))
      .concat({ txid: t.txInfo.txid, account: t.newAccount.name, block: t.txInfo.block })
    : t.accounts
      .map(a => ({ txid: t.txInfo.txid, account: a, block: t.txInfo.block })))));
  if (transactionsInfo.length) {
    try {
      await TransactionModelV2.insertMany(transactionsInfo);
      await TransactionLastHourModelV2.insertMany(transactionsInfo);
    } catch (e) {
      logError('Error with: TransactionModelV2.insertMany(transactionsInfo);');
      throw e;
    }
  }

  if (accountsToInsert.length) {
    try {
      await AccountModelV2.bulkWrite(accountsToInsert);
    } catch (e) {
      logError('Error with: AccountModelV2.bulkWrite(accountsToInsert);');
      throw e;
    }
  }

  if (transactionToAccountInfo.length) {
    try {
      await TransactionToAccountV2.insertMany(transactionToAccountInfo);
    } catch (e) {
    }
  }
  try {
    await ProducerModelV2.updateOne({ name: producer }, {
      $inc:
        {
          tx_count: transactions.length,
          produced: 1,
          produced_per_day: 1,
          'checkedData.tx_count': transactions.length,
          'checkedData.produced': 1,
          'checkedData2.tx_count': transactions.length,
          'checkedData2.produced': 1,
        },
    }).exec();
  } catch (e) {
    logError('Error with: ProducerModelV2.updateOne;');
    throw e;
  }
};

module.exports = saveBlockData;
