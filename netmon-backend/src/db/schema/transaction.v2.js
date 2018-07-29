const { Schema } = require('mongoose');

const Transaction = new Schema({
  txid: { type: String, index: true },
  action: { type: String, index: true },
  block: { type: Number },
  account: { type: String },
  date: { type: Date, default: Date.now, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  to: { type: String },
  description: { type: String },
  msgObject: {
    c1: String,
    c2: String,
    c3: String,
    c4: String,
    c5: String,
    c6: String,
  },
  mentionedAccounts: [String],
}, { collection: 'Transaction' });

module.exports = Transaction;
