const { CronJob } = require('cron');
const { connect: connectToDB } = require('../db');
const updateProducers = require('./updateProducers');
const updateProducersPositions = require('./updateProducersPositions');
const checkProducersSites = require('./checkProducersSites');
const startHandleBlockRoutine = require('./handleBlock');
const cleanTransactionsLastHourCollection = require('./cleanTransactionsLastHourCollection');
const calculateRewardsPerDay = require('./calculateRewardsPerDay');

const startUpdateProducersRoutine = () =>
  new CronJob({
    cronTime: '*/5 * * * *', // every 5 min
    onTick: updateProducers,
    start: true,
    timeZone: 'America/New_York',
  });

const startUpdateProducersPositionsRoutine = () =>
  new CronJob({
    cronTime: '*/2 * * * * *', // every 2 sec
    onTick: updateProducersPositions,
    start: true,
    timeZone: 'America/New_York',
  });

const startCheckProducersSitesRoutine = () =>
  new CronJob({
    cronTime: '*/30 * * * *', // every 30 min
    onTick: checkProducersSites,
    start: true,
    timeZone: 'America/New_York',
  });

const startCleanTransactionsLastHourCollection = () =>
  new CronJob({
    cronTime: '0,15,30,45 * * * *', // every 15 min
    onTick: cleanTransactionsLastHourCollection,
    start: true,
    timeZone: 'America/New_York',
  });

const startCalculateRewardsPerDay = () =>
  new CronJob({
    cronTime: '*/10 * * * *', // every 10 min
    onTick: calculateRewardsPerDay,
    start: true,
    timeZone: 'America/New_York',
  });

const startRoutine = async () => {
  await connectToDB();

  // update producers immediately
  //

  checkProducersSites()
  // start routine to update producers every 30min
  startUpdateProducersRoutine();

  // handle last block
  startHandleBlockRoutine();

  // clean TransactionsLastHourCollection
  startCleanTransactionsLastHourCollection();

  startCalculateRewardsPerDay();

  startUpdateProducersPositionsRoutine();

  startCheckProducersSitesRoutine();
};

startRoutine();
