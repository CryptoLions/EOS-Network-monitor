const { CronJob } = require('cron');
const { connect: connectToDB } = require('../db');
const updateProducers = require('./updateProducers');
const startHandleBlockRoutine = require('./handleBlock');

const startUpdateProducersRoutine = () => new CronJob({
  cronTime: '*/30 * * * * *', // every 30 sec
  onTick: () => updateProducers(),
  start: true,
  timeZone: 'America/New_York',
});

const startRoutine = async () => {
  await connectToDB();

  startUpdateProducersRoutine();
  // startHandleBlockRoutine();
};

startRoutine();
