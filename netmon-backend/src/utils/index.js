const { StateModelV2 } = require('../db');
const cleanAccountCollectionFromMentionedIn = require('./cleanAccountCollectionFromMentionedIn');
const updateTotalTransactionsCount = require('./updateTotalTransactionsCount');
const updateTpsAps = require('./updateTpsAps');
const updateTransactions = require('./updateTransactions');
const updateTransactionToAccountCollection = require('./updateTransactionToAccountCollection');
const checkProducedBlocks = require('./checkProducedBlocks');
const { createLogger } = require('../helpers');

const { error: logError } = createLogger();

const startUtilsIfNeed = async () => {
  const { utils } = await StateModelV2.findOne({ id: 1 }).select('utils').exec();
  if (utils.cleanAccountCollectionFromMentionedIn.start) {
    try {
      await cleanAccountCollectionFromMentionedIn();
      await StateModelV2.updateOne({ id: 1 }, { 'utils.cleanAccountCollectionFromMentionedIn.start': false }).exec();
    } catch (e) {
      logError(e);
    }
  }
  if (utils.updateTotalTransactionsCount.start) {
    try {
      await updateTotalTransactionsCount();
      await StateModelV2.updateOne({ id: 1 }, { 'utils.updateTotalTransactionsCount.start': false }).exec();
    } catch (e) {
      logError(e);
    }
  }
  if (utils.updateTpsAps.start) {
    try {
      await updateTpsAps();
      await StateModelV2.updateOne({ id: 1 }, { 'utils.updateTpsAps.start': false }).exec();
    } catch (e) {
      logError(e);
    }
  }
  if (utils.updateTransactionToAccountCollection.start) {
    try {
      await updateTransactionToAccountCollection();
      await StateModelV2.updateOne({ id: 1 }, { 'utils.updateTransactionToAccountCollection.start': false }).exec();
    } catch (e) {
      logError(e);
    }
  }
  if (utils.updateTransactions.start) {
    try {
      await updateTransactions();
      await StateModelV2.updateOne({ id: 1 }, { 'utils.updateTransactions.start': false }).exec();
    } catch (e) {
      logError(e);
    }
  }
  if (utils.checkProducedBlocks.start) {
    try {
      await checkProducedBlocks();
      await StateModelV2.updateOne({ id: 1 }, { 'utils.checkProducedBlocks.start': false }).exec();
    } catch (e) {
      logError(e);
    }
  }
};

module.exports = startUtilsIfNeed;
