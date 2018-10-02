const { Schema } = require('mongoose');

const Block = new Schema({
  blockNumber: { type: Number, default: 0, index: true },
  producer: { type: String, index: true },
  liveTps: { type: Number, default: 0 },
  liveAps: { type: Number, default: 0 },
  blockTps: { type: Number, default: 0 },
  blockAps: { type: Number, default: 0 },
  timestamp: { type: Number, default: 0 },
}, { collection: 'Block' });

Block.index({ blockNumber: 1 }, { unique: true, dropDups: true });

module.exports = Block;
