/* eslint no-await-in-loop:0 no-underscore-dangle:0 */
/* eslint no-mixed-operators:0 no-empty:0 */
const { connect, TransactionModelV2, TransactionToAccountV2 } = require('../db');
const { createLogger } = require('../helpers');

const { info: logInfo } = createLogger();
const BULK_WRITE_LIMIT = 100000;

const startMigration = async () => {
  await connect();

  const startTs = Date.now();
  logInfo(' Start updating ', new Date());
  const count = await TransactionModelV2
    .find({ block: { $eq: null } })
    .estimatedDocumentCount();
  const iterationsNumber = count / BULK_WRITE_LIMIT;
  for (let i = 0; i <= iterationsNumber + 1; i += 1) {
    const partStartTs = Date.now();
    const transactions = await TransactionModelV2.aggregate([
      { $project: { txid: 1, block: 1 } },
      { $skip: i * BULK_WRITE_LIMIT },
      { $limit: BULK_WRITE_LIMIT },
      { $group: { _id: '$txid', txid: { $first: '$txid' }, block: { $first: '$block' } } },
      { $project: { _id: 0, txid: 1, block: 1 } },
    ]);
    if (transactions.length > 0) {
      await TransactionToAccountV2.bulkWrite(
        transactions.map(t => ({
          updateOne: {
            filter: { txid: t.txid },
            update: { block: t.block },
            upsert: false,
          },
        })),
      );
      logInfo(`Part ${i} from ${count / BULK_WRITE_LIMIT} (approximately) finished.`);
      logInfo(`Time: ${Date.now() - partStartTs}ms`);
    } else {
      break;
    }
  }
  logInfo('WooooooHoooooo! Migration Finished');
  logInfo(`Time: ${Date.now() - startTs}ms`);
};

startMigration();
