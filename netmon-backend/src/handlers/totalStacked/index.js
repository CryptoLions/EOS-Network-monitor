const {
  LISTENERS: { ON_TOTAL_STACKED_CHANGE_INTERVAL },
  TOTAL_STACKED_CHECK_INTERVAL,
} = require('config');
const { createEosApi, castToInt, logError } = require('../../helpers');

const eosApi = createEosApi();

const getTotalStacked = async () => {
  try {
    const [stake] = await eosApi.getCurrencyBalance('eosio.token', 'eosio.stake');

    return castToInt(stake.split(' ')[0]) * 10000;
  } catch (e) {
    logError('get total stacked error');
    logError(e);
    return 0;
  }
};

const initTotalStackedHandler = async () => {
  const listeners = [];
  let totalStacked = await getTotalStacked();

  const notify = () => {
    listeners.forEach(listener => {
      listener(totalStacked);
    });
  };

  setInterval(async () => {
    try {
      totalStacked = await getTotalStacked();
    } catch (e) {
      return;
    }
    if (ON_TOTAL_STACKED_CHANGE_INTERVAL === 0) {
      notify();
    }
  }, TOTAL_STACKED_CHECK_INTERVAL);

  if (ON_TOTAL_STACKED_CHANGE_INTERVAL !== 0) {
    setInterval(notify, ON_TOTAL_STACKED_CHANGE_INTERVAL);
  }

  return {
    onUpdate(listener) {
      listeners.push(listener);
    },
  };
};

module.exports = initTotalStackedHandler;
