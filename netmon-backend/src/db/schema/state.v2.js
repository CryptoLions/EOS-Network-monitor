const { Schema } = require('mongoose');

const Producer = new Schema({
  id: Number,
  telegramUpdatedAt: Date,
  lastHandledBlock: { type: Number, default: 0 },
  max_aps: { type: Number, default: 0 },
  max_tps: { type: Number, default: 0 },
  max_tps_block: { type: Number, default: 0 },
  total_txblocks_count: { type: Number, default: 0 },
  tx_sum: { type: Number, default: 0 },
  utils: {
    updateTransactions: {
      lastCheckedBlock: { type: Number, default: 1 },
    },
  },
}, { collection: 'State' });

module.exports = Producer;
