const { ProducerModelV2 } = require('../../db');
const { BLOCKS_NUMBER_IN_PRODUCING_LOOP } = require('../../constants');
const { createLogger } = require('../../helpers');

const { error: logError } = createLogger();

const process = async ({ current, previous }) => {
  // The moment when routine just started working
  if (!previous.producer) {
    return;
  }
  const producer = await ProducerModelV2.findOne({ name: current.producer });
  if (!producer.lastLoopHeadBlockNumber && previous.producer === current.producer) {
    // When producer does not have data about his head loop blocks,
    // and previous block has been produced by this producer
    // We can not say which block is head for this producer loop, and can not count missed blocks
    return;
  }
  if (previous.producer !== current.producer) {
    // the previous block has not been produced by this producer
    // We mark the next loop head block, how many blocks left for this producer in the next loop
    // and how many blocks were missed by this producer
    const { blocksLeftInLastLoop } = producer;

    await ProducerModelV2.updateOne(
      { name: current.producer },
      {
        $set: {
          lastLoopHeadBlockNumber: current.block_num,
          blocksLeftInLastLoop: BLOCKS_NUMBER_IN_PRODUCING_LOOP - 1,
        },
        $inc: {
          missedBlocks: blocksLeftInLastLoop || 0,
        },
      },
    ).exec();
    return;
  }
  if (previous.producer === current.producer) {
    await ProducerModelV2.updateOne(
      { name: current.producer },
      { $inc: { blocksLeftInLastLoop: -1 } },
    ).exec();
    return;
  }
  logError('Processing Missed Blocks: Error');
};

module.exports = process;
