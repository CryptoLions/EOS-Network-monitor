const { CronJob } = require('cron');
const { connect: connectToDB } = require('../db');
const { CALCULATE_REWARDS_FOR_DAY_INTERVAL } = require('../constants');
const updateProducers = require('./updateProducers');
const updateProducersFast = require('./updateProducersFast');
const checkProducersSites = require('./checkProducersSites');
const startHandleBlockRoutine = require('./handleBlock');
const cleanTransactionsLastHourCollection = require('./cleanTransactionsLastHourCollection');
const calculateRewardsPerDay = require('./calculateRewardsPerDay');
const resetMissedBlocksForDay = require('./resetMissedBlocksForDay');
const resetProducedTimesForDay = require('./resetProducedTimesForDay');

const startUpdateProducersRoutine = () => {
  updateProducers();
  return new CronJob({
    cronTime: '*/5 * * * *', // every 5 min
    onTick: updateProducers,
    start: true,
  });
};


const startUpdateProducersFastRoutine = () =>
  new CronJob({
    cronTime: '*/2 * * * * *', // every 2 sec
    onTick: updateProducersFast,
    start: true,
  });

const startCheckProducersSitesRoutine = () =>
  new CronJob({
    cronTime: '*/30 * * * *', // every 30 min
    onTick: checkProducersSites,
    start: true,
  });

const startCleanTransactionsLastHourCollection = () =>
  new CronJob({
    cronTime: '0,15,30,45 * * * *', // every 15 min
    onTick: cleanTransactionsLastHourCollection,
    start: true,
  });

const startCalculateRewardsPerDay = () => {
  calculateRewardsPerDay();
  setInterval(calculateRewardsPerDay, CALCULATE_REWARDS_FOR_DAY_INTERVAL);
};

const startResetMissedBlocksForDay = () =>
  new CronJob({
    cronTime: '0 0 * * *', // every day
    onTick: resetMissedBlocksForDay,
    start: true,
  });

const startResetProducedTimesForDay = () =>
  new CronJob({
    cronTime: '0 0 * * *', // every day
    onTick: resetProducedTimesForDay,
    start: true,
  });

const startRoutine = async () => {
  await connectToDB();

  startUpdateProducersRoutine();

  startHandleBlockRoutine();

  startCleanTransactionsLastHourCollection();

  startCalculateRewardsPerDay();

  startUpdateProducersFastRoutine();

  startCheckProducersSitesRoutine();

  startResetMissedBlocksForDay();

  startResetProducedTimesForDay();
};

startRoutine();
