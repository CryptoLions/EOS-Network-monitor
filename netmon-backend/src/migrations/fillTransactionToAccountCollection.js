/* eslint no-await-in-loop:0 no-underscore-dangle:0 */
/* eslint no-mixed-operators:0 no-empty:0 */
const { connect, AccountModelV2, TransactionToAccountV2 } = require('../db');
const { createLogger } = require('../helpers');

const { info: logInfo } = createLogger();

const BULK_WRITE_LIMIT = 100000;

const startMigration = async () => {
  await connect();

  logInfo('Select all accounts without mentionedIn');

  const accounts = await AccountModelV2.find({})
    .select('_id name')
    .exec();

  logInfo('Remove all data from the TransactionToAccount collection');
  await TransactionToAccountV2.remove({});

  logInfo('Removing: Done');

  for (let i = 0; i < accounts.length; i += 1) {
    logInfo(`Select mentionedIn for account ${i}:${accounts[i].name}`);
    const accountid = accounts[i]._id;
    const accountName = accounts[i].name;
    const account = await AccountModelV2.findOne({ _id: accountid })
      .select('_id mentionedIn')
      .exec();
    logInfo(`The mentionedIn length is ${account.mentionedIn.length}`);

    const numberOfSteps = Math.ceil(account.mentionedIn.length / BULK_WRITE_LIMIT);
    logInfo(`The migration will be done in ${numberOfSteps} steps`);
    for (let j = 0; j < numberOfSteps; j += 1) {
      const partOfMentionedIn = account.mentionedIn.slice(j, j * BULK_WRITE_LIMIT + BULK_WRITE_LIMIT);
      try {
        await TransactionToAccountV2.insertMany(
          partOfMentionedIn.map(txid => ({
            txid,
            account: accountName,
          })),
          {
            ordered: false,
          },
        );
      } catch (e) {}

      logInfo(`Step ${j} done`);
    }

    logInfo(`Migration for ${accounts[i].name} done!`);
    logInfo('---------------------------------------');
  }

  logInfo('WooooooHoooooo! Migration Finished');
};

startMigration();
