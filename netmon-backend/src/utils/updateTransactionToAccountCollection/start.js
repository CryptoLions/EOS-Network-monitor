const { connect } = require('../../db');
const updateTransactionToAccountCollection = require('./index');

const start = async () => {
  await connect();
  updateTransactionToAccountCollection();
};

start();
