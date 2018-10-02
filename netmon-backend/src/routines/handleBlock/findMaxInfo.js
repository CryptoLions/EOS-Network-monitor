/* eslint-disable no-param-reassign */
const getActionsCount = require('./getActionsCount');
const { createEosApi } = require('../../helpers');
const { SECOND } = require('../../constants');

const eosApi = createEosApi();

const findMaxInfo = async ({ current = { transactions: [] }, previous, max_tps = 0, max_aps = 0 }) => {
  if (!previous || !previous.block_num) {
    previous = await eosApi.getBlock(current.block_num - 1);
  }
  const currentTs = Date.parse(current.timestamp);
  const previousTs = Date.parse(previous.timestamp);
  if (currentTs === previousTs) {
    return undefined;
  }
  let live_tps;
  let live_aps;
  // the block was produced in one second or more
  if (currentTs - previousTs >= SECOND) {
    const transactionsNumber = current.transactions.length;
    const actionsNumber = getActionsCount(current);
    const producedInSeconds = (currentTs - previousTs) / SECOND;
    live_tps = transactionsNumber / producedInSeconds;
    live_aps = actionsNumber / producedInSeconds;
  } else {
    // the block was produced in half of second
    // find number of transactions for 0.5 sec for previous block
    if (!previous.producedInSeconds) {
      const beforePrevious = await eosApi.getBlock(previous.block_num - 1);
      previous.producedInSeconds = (Date.parse(previous.timestamp) - Date.parse(beforePrevious.timestamp)) / SECOND;
    }
    const previousTransactionsNumber = current.transactions.length;

    live_tps = current.transactions.length + (previousTransactionsNumber / previous.producedInSeconds / 2);
    live_aps = getActionsCount(current) + (getActionsCount(previous) / previous.producedInSeconds / 2);
  }
  live_aps = live_aps < live_tps ? live_tps : live_aps;
  const res = {};
  if (live_tps > max_tps) {
    res.max_tps = live_tps;
    res.max_tps_block = current.block_num;
  }
  if (live_aps > max_aps) {
    res.max_aps_block = current.block_num;
    res.max_aps = live_aps;
  }
  if (res.max_aps || res.max_tps) {
    return res;
  }
  return undefined;
};

module.exports = findMaxInfo;
