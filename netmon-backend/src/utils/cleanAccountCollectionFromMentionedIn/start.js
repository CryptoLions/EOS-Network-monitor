const { connect } = require('../../db');
const cleanAccountCollection = require('./index');

const start = async () => {
  await connect();
  cleanAccountCollection();
};

start();
