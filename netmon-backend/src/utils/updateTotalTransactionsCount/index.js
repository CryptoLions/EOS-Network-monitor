const {
  TransactionModelV2,
  StateModelV2,
} = require('../../db');
const { createLogger } = require('../../helpers');

const { info: logInfo } = createLogger();

const update = async () => {
  const totalTransactionsCount = await TransactionModelV2
    .countDocuments();
  logInfo(`Total transactions count: ${totalTransactionsCount}`);
  await StateModelV2.updateOne({ id: 1 }, { $set: { totalTransactionsCount } }).exec();
  logInfo('Finished');
};

module.exports = update;
