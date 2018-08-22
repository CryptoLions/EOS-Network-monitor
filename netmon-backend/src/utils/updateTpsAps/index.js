const { createEosApi, createLogger } = require('../../helpers');
const { TransactionModelV2, StateModelV2 } = require('../../db');
const findMaxInfo = require('../../routines/handleBlock/findMaxInfo');

const { info: logInfo } = createLogger();
const api = createEosApi();

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
