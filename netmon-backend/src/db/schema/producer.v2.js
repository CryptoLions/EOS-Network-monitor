const { Schema } = require('mongoose');
const Node = require('./node.v2');

const Producer = new Schema({
  name: { type: String, index: true },
  produced: { type: Number, index: true, default: 0 },
  tx_count: { type: Number, index: true, default: 0 },
  total_votes: { type: Number, index: true, default: 0 },
  rewards_per_day: { type: Number, default: 0 },
  produced_per_day: { type: Number, default: 0 },
  producer_key: String,
  url: String,
  unpaid_blocks: Number,
  last_claim_time: Number,
  location: String,
  lastGoodAnsweredTime: Date,
  nodes: [Node],
  specialNodeEndpoint: {
    host: { type: String, default: null },
    port: { type: String, default: null },
    use: { type: Boolean, default: false },
  },
}, { collection: 'Producer' });

module.exports = Producer;
