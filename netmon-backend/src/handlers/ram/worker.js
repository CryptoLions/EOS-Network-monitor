const { RAM_CHECK_INTERVAL } = require('config');
const { eosApi, logError, setSensitiveInterval } = require('../../helpers');
const { connect, RamModelV2 } = require('../../db');
const { KILOBYTE } = require('../../constants');

let previousRam = {};

const RAM_CHECK_DEFAULT_INTERVAL = 500;

const addPriceField = ram => ({
  base: ram.base,
  quote: ram.quote,
  date: ram.date,
  price: ((ram.quote / ram.base) * KILOBYTE).toFixed(5),
});

const notify = (ram) => {
  try {
    process.send(addPriceField(ram));
  } catch (e) {
    logError(e);
  }
};

const updateRam = async () => {
  try {
    const { rows: [ramInfo] } = await eosApi.getTableRows({
      json: true,
      code: 'eosio',
      scope: 'eosio',
      table: 'rammarket',
      limit: 10,
    });
    const quote = Number(ramInfo.quote.balance.split(' ')[0]);
    const base = Number(ramInfo.base.balance.split(' ')[0]);
    const ram = { quote, base, date: new Date() };
    if (ram.base !== previousRam.base || ram.quote !== previousRam.quote) {
      previousRam = { ...ram };
      new RamModelV2(ram).save();
      notify(ram);
    }
  } catch (e) {
    logError('Ram updating error');
    logError(e);
  }
};

const initInfoHandler = async () => {
  await connect();
  setSensitiveInterval(updateRam, RAM_CHECK_INTERVAL || RAM_CHECK_DEFAULT_INTERVAL);
};

initInfoHandler();
