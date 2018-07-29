const { Schema } = require('mongoose');
const Node = require('./node.v2');

const Producer = new Schema({
  name: { type: String, index: true },
  produced: { type: Number, index: true, default: 0 },
  tx_count: { type: Number, index: true, default: 0 },
  total_votes: { type: Number, index: true, default: 0 },
  producer_key: String,
  url: String,
  unpaid_blocks: Number,
  last_claim_time: Number,
  location: String,
  nodes: [Node],
}, { collection: 'Producer' });

module.exports = Producer;
