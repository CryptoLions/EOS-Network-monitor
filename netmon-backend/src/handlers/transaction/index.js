/* eslint-disable no-param-reassign,no-mixed-operators */
const {
  LISTENERS: { ON_TRANSACTIONS_ADD_INTERVAL },
} = require('config');

const { TransactionModelV2, StateModelV2 } = require('../../db');
const { castToInt } = require('../../helpers');

const getBlocksCountInfo = async () => {
  const state = await StateModelV2.findOne({ id: 1 });
  // return state && state.total_txblocks_count || 0;
  return {
    notEmptyBlocksCount: (state && state.total_txblocks_count) || 0,
    totalBlockCount: (state && state.lastHandledBlock) || 0,
  };
};

const getTransactions = ({ tsStart, tsEnd, actions }) => {
  const pipeline = [];
  if (actions && actions.length > 1) {
    pipeline.push({ $match: { action: { $in: actions } } });
  } else if (actions && actions.length === 1) {
    pipeline.push({ $match: { action: actions[0] } });
  }
  pipeline.push({ $match: { createdAt: { $gte: new Date(castToInt(tsStart)) } } });
  if (tsEnd) {
    pipeline.push({ $match: { createdAt: { $lte: new Date(castToInt(tsEnd)) } } });
  }
  pipeline.push({ $limit: 100 });
  return TransactionModelV2.aggregate(pipeline);
};

const initHandler = () => {
  const listeners = [];

  const notify = async () => {
    // const transactions = await getTransactions({ tsStart: Date.now() - ON_TRANSACTIONS_ADD_INTERVAL });
    const totalTransactionsCount = await TransactionModelV2.estimatedDocumentCount({});
    const { notEmptyBlocksCount, totalBlockCount } = await getBlocksCountInfo();
    listeners.forEach(async listener => {
      listener({
        transactions: [],
        totalTransactionsCount,
        notEmptyBlocksCount,
        totalBlockCount,
      });
    });
  };

  setInterval(notify, ON_TRANSACTIONS_ADD_INTERVAL);

  return {
    onUpdate(listener) {
      listeners.push(listener);
    },
    getTransactions,
  };
};

module.exports = initHandler;
