const { LISTENERS: { ON_TOTAL_STACKED_CHANGE_INTERVAL }, TOTAL_STACKED_CHECK_INTERVAL } = require('config');
const { createEosApi } = require('../../helpers');

const eosApi = createEosApi();

const getTotalStacked = async () => {
  const { rows: [{ total_activated_stake }] } =
    await eosApi.getTableRows({ json: true, scope: 'eosio', code: 'eosio', table: 'global' });

  return total_activated_stake;
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
