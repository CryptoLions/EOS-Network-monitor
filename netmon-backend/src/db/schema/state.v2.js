const { Schema } = require('mongoose');
const { UPDATE_TRANSACTIONS: { DEFAULT_VALUE } } = require('config');

const Producer = new Schema({
  id: Number,
  telegramUpdatedAt: Date,
  lastHandledBlock: { type: Number, default: 0 },
  max_aps: { type: Number, default: 0 },
  max_tps: { type: Number, default: 0 },
  max_tps_block: { type: Number, default: 0 },
  max_aps_block: { type: Number, default: 0 },
  total_txblocks_count: { type: Number, default: 0 },
  tx_sum: { type: Number, default: 0 },
  totalTransactionsCount: { type: Number, default: 0 },
  lastRewardsSetToZeroAt: { type: Date, default: new Date(0) },
  produced_per_day: { type: Number, default: 0 },
  adminData: {
    frontendPageReloadAt: { type: Date, default: 0 },
  },
  utils: {
    updateTransactions: {
      start: { type: Boolean, default: true },
      lastCheckedBlock: { type: Number, default: DEFAULT_VALUE },
    },
    cleanAccountCollectionFromMentionedIn: {
      start: { type: Boolean, default: true },
    },
    updateTotalTransactionsCount: {
      start: { type: Boolean, default: true },
    },
    updateTpsAps: {
      start: { type: Boolean, default: false },
    },
    updateTransactionToAccountCollection: {
      start: { type: Boolean, default: true },
    },
  },
}, { collection: 'State' });

module.exports = Producer;
