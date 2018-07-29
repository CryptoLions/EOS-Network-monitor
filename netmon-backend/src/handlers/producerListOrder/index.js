/* eslint-disable no-mixed-operators */
const { PRODUCERS_CHECK_INTERVAL } = require('config');

const { createEosApi } = require('../../helpers');

const eosApi = createEosApi();

const getProducersInfo = async () => {
  const { rows } = await eosApi.getProducers({ json: true, limit: 100 });
  return rows.map(e => e.owner);
};


const initProducerHandler = async () => {
  const listeners = [];

  const previousState = [];

  const notify = () => {
    listeners.forEach(listener => {
      listener();
    });
  };

  const checkProducers = async () => {
    const nextState = await getProducersInfo();
    const orderIsChanged = nextState.find((e, i) => e !== previousState[i]);
    if (orderIsChanged) {
      previousState.length = 0;
      previousState.push(...nextState);
      notify();
    }
  };

  setInterval(checkProducers, PRODUCERS_CHECK_INTERVAL);

  return {
    onUpdate(listener) {
      listeners.push(listener);
    },
  };
};

module.exports = initProducerHandler;
