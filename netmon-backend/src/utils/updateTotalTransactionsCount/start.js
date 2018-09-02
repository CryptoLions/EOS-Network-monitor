const { connect } = require('../../db');
const updateTotalTransactionsCount = require('./index');

const start = async () => {
  await connect();
  updateTotalTransactionsCount();
};

start();
