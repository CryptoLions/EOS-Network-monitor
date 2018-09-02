const { connect } = require('../../db');
const checkProducedBlocks = require('./index');

const start = async () => {
  await connect();
  checkProducedBlocks();
};

start();
