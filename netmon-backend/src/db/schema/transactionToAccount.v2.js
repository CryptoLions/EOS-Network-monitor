const { Schema } = require('mongoose');

const TransactionToAccount = new Schema(
  {
    txid: { type: String, index: true },
    account: { type: String, index: true },
    block: { type: Number, index: true },
  },
  { collection: 'TransactionToAccount' },
);

TransactionToAccount.index({ txid: 1, account: 1 }, { unique: true, dropDups: true });

module.exports = TransactionToAccount;
