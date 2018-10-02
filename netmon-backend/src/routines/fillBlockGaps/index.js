/* eslint-disable no-param-reassign,no-await-in-loop */
const moment = require('moment');
const { LAST_BLOCKS_NUMBER_FOR_CALCULATING_AVG_APS_TPS } = require('config');
const { BlockModelV2 } = require('../../db');
const { DAY, SECOND } = require('../../constants');
const { eosApi, pickAs, logInfo, logError } = require('../../helpers');
const getActionsCount = require('../../routines/handleBlock/getActionsCount');
const createBlockDataComposer = require('../../handlers/info/blockDataComposer');

const getBlockNumbersForPeriod = async ({ from, to }) =>
  (await BlockModelV2
    .find({ timestamp: { $gt: from, $lt: to } })
    .sort({ blockNumber: 1 })
    .select('blockNumber')
    .exec())
    .map(b => b.blockNumber);

const getBlockFromChain = async (blockNum) => {
  const [beforePrevious, previous, current] = await Promise.all([
    eosApi.getBlock(blockNum - 2),
    eosApi.getBlock(blockNum - 1),
    eosApi.getBlock(blockNum),
  ]);
  let blockTps;
  let blockAps;
  const timestamp = moment.utc(current.timestamp).valueOf();
  const { producer } = current;
  const currentTs = Date.parse(current.timestamp);
  const previousTs = Date.parse(previous.timestamp);
  if (currentTs - previousTs >= SECOND) {
    const transactionsNumber = current.transactions.length;
    const actionsNumber = getActionsCount(current);
    const producedInSeconds = (currentTs - previousTs) / SECOND;
    blockTps = transactionsNumber / producedInSeconds;
    blockAps = actionsNumber / producedInSeconds;
  } else {
    previous.producedInSeconds = (Date.parse(previous.timestamp) - Date.parse(beforePrevious.timestamp)) / SECOND;
    const previousTransactionsNumber = current.transactions.length;

    blockTps = current.transactions.length + (previousTransactionsNumber / previous.producedInSeconds / 2);
    blockAps = getActionsCount(current) + (getActionsCount(previous) / previous.producedInSeconds / 2);
  }
  return {
    blockNumber: blockNum,
    producer,
    blockTps,
    blockAps,
    timestamp,
  };
};

const getPreviousBlocks = async (blockNum) => {
  const blockFromDb = await BlockModelV2
    .find({ blockNumber: { $lt: blockNum, $gt: blockNum - LAST_BLOCKS_NUMBER_FOR_CALCULATING_AVG_APS_TPS - 1 } })
    .sort({ blockNumber: -1 })
    .exec();
  if (blockFromDb.length === LAST_BLOCKS_NUMBER_FOR_CALCULATING_AVG_APS_TPS) {
    return blockFromDb;
  }
  const blocks = [];
  for (let i = blockNum - LAST_BLOCKS_NUMBER_FOR_CALCULATING_AVG_APS_TPS; i < blockNum; i += 1) {
    const block = blockFromDb.find(b => b.blockNumber === blockNum);
    blocks.push(block || await getBlockFromChain(blockNum));
  }
  return blocks;
};

const findGaps = (blocks) => {
  const gaps = [];
  for (let i = 0; i < blocks.length - 1; i += 1) {
    if (blocks[i] + 1 < blocks[i + 1]) {
      for (let j = blocks[i] + 1; j < blocks[i + 1]; j += 1) {
        gaps.push(j);
      }
    }
  }
  return gaps;
};

const fillGap = async (gapNumber) => {
  const composer = createBlockDataComposer();
  const previousBlocks = await getPreviousBlocks(gapNumber);
  composer.updateStorage({
    previous: await eosApi.getBlock(gapNumber - 1),
    previous_live_aps: previousBlocks.map(b => b.blockAps),
    previous_live_tps: previousBlocks.map(b => b.blockTps),
    replacedNumber: LAST_BLOCKS_NUMBER_FOR_CALCULATING_AVG_APS_TPS,
  });
  const block = composer.composeData({
    block: await eosApi.getBlock(gapNumber),
  });
  const chartBlock = pickAs(block, {
    blockNumber: 'block_num',
    producer: 'producer',
    liveTps: 'live_tps',
    liveAps: 'live_aps',
    blockTps: 'block_tps',
    blockAps: 'block_aps',
    timestamp: () => moment.utc(block.timestamp).valueOf(),
  });
  await BlockModelV2.updateOne({ blockNumber: chartBlock.blockNumber }, chartBlock, { upsert: true }).exec();
  logInfo(`Gap ${gapNumber} was filled`);
};

const fill = async ({ from, to = Date.now() } = {}) => {
  try {
    if (!from || to - from > DAY / 2) {
      from = to - (DAY / 2);
    }
    const blockNumbers = await getBlockNumbersForPeriod({ from, to });
    const gaps = findGaps(blockNumbers);
    if (!gaps || gaps.length < 1) {
      return;
    }
    logInfo(`Quantity of gaps [Blocks for chart] ${gaps.length}`, { send: true });
    for (let i = 0; i < gaps.length; i += 1) {
      await fillGap(gaps[i]);
    }
  } catch (e) {
    logError('Block for chart error');
    logError(e);
  }
};

module.exports = fill;
