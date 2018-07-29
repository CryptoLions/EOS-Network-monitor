const { Schema } = require('mongoose');

const Account = new Schema({
  name: { type: String, index: true },
  createdBy: String,
  createdAccounts: { type: [String], index: true },
  date: { type: Date, default: Date.now },
  balances: {
    EOS: { type: Number, default: 0.0 },
  },
  mentionedIn: [String],
}, { collection: 'Account' });

module.exports = Account;
