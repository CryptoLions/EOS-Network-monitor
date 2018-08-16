const { createEosApi, createLogger } = require('../../helpers');
const { TransactionModelV2, StateModelV2 } = require('../../db');

const { info: logInfo } = createLogger();
const api = createEosApi();

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
  const SECOND = 1000;
  const currentTs = Date.parse(current.timestamp);
  const previousTs = Date.parse(previous.timestamp);
  if (currentTs === previousTs) {
    return undefined;
  }
  let live_tps;
  let live_aps;
  if (currentTs - previousTs >= SECOND) {
    live_tps = current.transactions.length;
    live_aps = getActionsCount(current);
  } else {
    live_tps = current.transactions.length + (previous.transactions ? previous.transactions.length : 0);
    live_aps = getActionsCount(current) + (previous.transactions ? getActionsCount(previous) : 0);
  }
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

const check = async () => {
  const [{ transactions: maxPerOneBlock }] = await TransactionModelV2.aggregate([
    { $group: { _id: '$txid', block: { $first: '$block' } } },
    { $group: { _id: '$block', transactions: { $sum: 1 } } },
    { $sort: { transactions: -1 } },
    { $group: { _id: null, num: { $first: '$_id' }, transactions: { $first: '$transactions' } } },
  ]);
  const blocks = await TransactionModelV2.aggregate([
    { $group: { _id: '$txid', block: { $first: '$block' } } },
    { $group: { _id: '$block', transactions: { $sum: 1 } } },
    { $sort: { transactions: -1 } },
    { $match: { transactions: { $gt: maxPerOneBlock / 2 } } },
  ]);
  logInfo('max transactions per block:', maxPerOneBlock);
  logInfo(blocks);

  const handledBlocks = await Promise.all(blocks.map(async block => ({
    previous: await api.getBlock(block._id),
    current: await api.getBlock(block._id + 1),
  })).concat(blocks.map(async block => ({
    previous: await api.getBlock(block._id - 1),
    current: await api.getBlock(block._id),
  }))));
  const res = handledBlocks.reduce((acc, val) => {
    const max = findMaxInfo({ ...val, ...acc });
    if (max) {
      return {
        ...acc,
        ...max,
      };
    }
    return acc;
  }, { max_tps: 0, max_aps: 0, max_tps_block: 0 });
  StateModelV2.updateOne({ id: 1 }, { $set: res }).exec();
};
module.exports = check;
