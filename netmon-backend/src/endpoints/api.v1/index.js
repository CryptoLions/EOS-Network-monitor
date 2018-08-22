const { API_PREFIX } = require('config');

const { castToInt } = require('../../helpers');

const { TransactionModelV2, TransactionToAccountV2 } = require('../../db');

const init = ({ app, handlers }) => {
  const { table: tableHandler, info: infoHandler, account: accountHandler, transaction: transactionHandler } = handlers;
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
    const mentionedIn = await TransactionToAccountV2
      .find({ account: name })
      .select('txid')
      .sort({ block: -1 })
      .limit(castToInt(limit))
      .skip(castToInt(skip))
      .exec();
    const count = await TransactionToAccountV2
      .find({ account: name })
      .countDocuments();
    const txids = mentionedIn.map(item => item.txid);

    if (!mentionedIn.length) {
      res.send([]);
      return;
    }

    const history = await TransactionModelV2.aggregate([
      { $match: { txid: { $in: txids } } },
      {
        $group: {
          _id: '$txid',
          id: { $first: '$_id' },
          msgObject: { $first: '$msgObject' },
          mentionedAccounts: { $first: '$mentionedAccounts' },
          txid: { $first: '$txid' },
          block: { $first: '$block' },
          account: { $first: '$account' },
          to: { $first: '$to' },
          action: { $first: '$action' },
          date: { $first: '$date' },
          description: { $first: '$description' },
          createdAt: { $first: '$createdAt' },
        },
      },
      { $sort: { block: -1 } },
    ]);
    const correctedHistory = history.filter(e => Object.keys(e).length > 0).slice(0, limit);
    res
      .set('count', count)
      .status(200)
      .send(correctedHistory);
  });
  app.get(`${API_PREFIX}/transactions/:txid/`, async (req, res) => {
    const { txid } = req.params;
    const tx = await TransactionModelV2.findOne({ txid });
    res.status(200).send(tx);
  });
  app.get(`${API_PREFIX}/transactions/`, async (req, res) => {
    const now = Date.now();
    const { tsStart = now - 1000, tsEnd, actions } = req.query;
    const correctedActions = actions && actions.split(',');
    const history = await transactionHandler.getTransactions({ tsStart, tsEnd, actions: correctedActions });
    res.status(200).send(history);
  });
};

module.exports = init;
