
const { API_PREFIX } = require('config');

const { TransactionModelV2, AccountModelV2 } = require('../../db');
const { castToInt } = require('../../helpers');

const init = ({ app, handlers }) => {
  const {
    table: tableHandler,
    info: infoHandler,
    account: accountHandler,
    transaction: transactionHandler,
  } = handlers;
  app.get(`${API_PREFIX}/table/`, (req, res) => {
    const table = tableHandler.getAll();
    res.status(200).send(table);
  });
  app.get(`${API_PREFIX}/blocks/:number/`, async (req, res) => {
    const { number } = req.params;
    const block = await infoHandler.getBlockInfo(number);
    res.status(200).send(block);
  });
  app.get(`${API_PREFIX}/accounts/:name/`, async (req, res) => {
    const { name } = req.params;
    const account = await accountHandler.getAccount(name);
    res.status(200).send(account);
  });
  app.get(`${API_PREFIX}/accounts/:name/history/`, async (req, res) => {
    const { name } = req.params;
    const { skip = 0, limit = 10 } = req.query;
    const history = await AccountModelV2.aggregate([
      { $match: { name } },
      { $project: { mentionedIn: 1, array: '$mentionedIn' } },
      { $unwind: '$mentionedIn' },
      { $project: { mentionedIn: 1, position: { $indexOfArray: ['$array', '$mentionedIn'] } } },
      { $group: { _id: '$mentionedIn', position: { $first: '$position' } } }, // mentionedIn: { $last: '$mentionedIn' } } },
      { $sort: { position: -1 } },
      { $skip: castToInt(skip) },
      { $limit: castToInt(limit) },
      {
        $lookup:
          {
            from: 'Transaction',
            localField: '_id',
            foreignField: 'txid',
            as: 'transactions',
          },
      },
      { $project: { transaction: { $arrayElemAt: ['$transactions', 0] }, _id: 0 } },
      { $project: {
        txid: '$transaction.txid',
        action: '$transaction.action',
        block: '$transaction.block',
        account: '$transaction.account',
        date: '$transaction.date',
        to: '$transaction.to',
        description: '$transaction.description',
        msgObject: '$transaction.msgObject',
        mentionedAccounts: '$transaction.mentionedAccounts',
      },
      },
    ]);
    res
      .status(200)
      .send(history);
  });
  app.get(`${API_PREFIX}/transactions/:txid/`, async (req, res) => {
    const { txid } = req.params;
    const tx = await TransactionModelV2.findOne({ txid });
    res
      .status(200)
      .send(tx);
  });
  app.get(`${API_PREFIX}/transactions/`, async (req, res) => {
    const now = Date.now();
    const { tsStart = now - 1000, tsEnd, actions } = req.query;
    const correctedActions = actions && actions.split(',');
    const history = await transactionHandler.getTransactions({ tsStart, tsEnd, actions: correctedActions });
    res
      .status(200)
      .send(history);
  });
};

module.exports = init;
