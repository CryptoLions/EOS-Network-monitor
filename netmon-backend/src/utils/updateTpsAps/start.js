const { connect } = require('../../db');
const updateTpsAps = require('./index');

const start = async () => {
  await connect();
  updateTpsAps();
};

start();
