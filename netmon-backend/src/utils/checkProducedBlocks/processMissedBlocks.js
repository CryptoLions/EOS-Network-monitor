const { ProducerModelV2, StateModelV2 } = require('../../db');
const { BLOCKS_NUMBER_IN_PRODUCING_LOOP } = require('../../constants');
const { createLogger } = require('../../helpers');

const { error: logError } = createLogger();

const process = async ({ current, previous }) => {
  // The moment when routine just started working
  try {
    if (!previous.producer) {
      return;
    }
    const producer = await ProducerModelV2
      .findOne({ name: current.producer })
      .select('checkedData2');
    if (!producer) {
      return;
    }
    const { checkedData2: producerData } = producer;
    if (!producerData.lastLoopHeadBlockNumber && previous.producer === current.producer) {
      // When producer does not have data about his head loop blocks,
      // and previous block has been produced by this producer
      // We can not say which block is head for this producer loop, and can not count missed blocks
      return;
    }
    if (previous.producer !== current.producer) {
      // the previous block has not been produced by this producer
      // We mark the next loop head block, how many blocks left for this producer in the next loop
      // and how many blocks were missed by this producer
      const { blocksLeftInLastLoop } = producerData ;
      await ProducerModelV2.updateOne(
        { name: current.producer },
        {
          $set: {
            'checkedData2.lastLoopHeadBlockNumber': current.block_num,
            'checkedData2.blocksLeftInLastLoop': BLOCKS_NUMBER_IN_PRODUCING_LOOP - 1,
          },
          $inc: {
            'checkedData2.totalMissedBlocks': blocksLeftInLastLoop > 0 ? blocksLeftInLastLoop : 0,
          },
        },
      ).exec();
      await StateModelV2.updateOne(
        { id: 1 },
        { $inc: { 'checkedData2.missedProducedBlocks': blocksLeftInLastLoop > 0 ? blocksLeftInLastLoop : 0 } },
      ).exec();
      return;
    }
    if (previous.producer === current.producer) {
      await ProducerModelV2.updateOne(
        { name: current.producer },
        { $inc: { 'checkedData2.blocksLeftInLastLoop': -1 } },
      ).exec();
      return;
    }
    logError('Processing Missed Blocks: Error');
  } catch (e) {
    logError(e);
  }
};

module.exports = process;
