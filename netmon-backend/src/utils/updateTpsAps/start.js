const { connect } = require('../../db');
const doWork = require('./index');

const start = async () => {
  await connect();
  doWork();
};

start();
