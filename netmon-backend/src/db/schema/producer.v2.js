const { Schema } = require('mongoose');
const Node = require('./node.v2');

const Producer = new Schema({
  name: { type: String, index: true },
  isActive: { type: Boolean, default: true },
  checkedData: { // deprecated
    produced: { type: Number, default: 0 },
    tx_count: { type: Number, default: 0 },
  },
  checkedData2: {
    produced: { type: Number, default: 0 },
    tx_count: { type: Number, default: 0 },
    totalMissedBlocks: { type: Number, default: 0 },
    lastLoopHeadBlockNumber: Number,
    blocksLeftInLastLoop: { type: Number, default: 0 },
  },
  expectedIncomeData: {
    producedTimesForDay: { type: Number, default: 0 },
    voteRewardsForDay: { type: Number, default: 0 },
    expectedBlockRewardsForDay: { type: Number, default: 0 },
    expectedRewardsOnThisPosition: { type: Number, default: 0 },
    totalBlockUnpaidRewards: { type: Number, default: 0 },
  },
  total_votes: { type: Number, index: true, default: 0 },
  rewards_per_day: { type: Number, default: 0 }, // deprecated
  produced_per_day: { type: Number, default: 0 },
  producer_key: String,
  url: String,
  unpaid_blocks: Number,
  last_claim_time: Number,
  location: String,
  lastGoodAnsweredTime: Date,
  isSiteAvailable: Boolean,
  missedBlocks: { type: Number, default: 0 }, // deprecated
  missedBlocksForDay: { type: Number, default: 0 },
  missedBlocksForRound: { type: Number, default: 0 },
  missedBlocksTotal: { type: Number, default: 0 },
  lastLoopHeadBlockNumber: Number,
  blocksLeftInLastLoop: { type: Number, default: 0 },
  nodes: [Node],
  specialNodeEndpoint: {
    host: { type: String, default: null },
    port: { type: String, default: null },
    use: { type: Boolean, default: false },
  },
}, { collection: 'Producer' });

module.exports = Producer;
