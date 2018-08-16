const { CronJob } = require('cron');
const { connect: connectToDB } = require('../db');
const updateProducers = require('./updateProducers');
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
  updateProducers();
  // start routine to update producers every 30min
  startUpdateProducersRoutine();

  // handle last block
  startHandleBlockRoutine();

  // clean TransactionsLastHourCollection
  startCleanTransactionsLastHourCollection();

  startCalculateRewardsPerDay();
};

startRoutine();
