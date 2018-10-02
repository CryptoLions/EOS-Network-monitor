const { connect } = require('../../db');
const fillBlockGaps = require('./index');

const start = async () => {
  await connect();
  fillBlockGaps();
};

start();
