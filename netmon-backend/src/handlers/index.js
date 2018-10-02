const initUserCountHandler = require('./userCount');
const initTableHandler = require('./table');
const initTransactionHandler = require('./transaction');
const initTotalStackedHandler = require('./totalStacked');
const initInfoHandler = require('./info');
const initAccountHandler = require('./account');
const initRamHandler = require('./ram');

const init = async () => {
  const userCount = await initUserCountHandler();
  const table = await initTableHandler();
  const transaction = await initTransactionHandler();
  const totalStacked = await initTotalStackedHandler();
  const info = await initInfoHandler();
  const account = await initAccountHandler();
  const ram = await initRamHandler();

  info.onUpdate(infoData => table.setCurrentInfo(infoData));
  return {
    userCount,
    table,
    totalStacked,
    transaction,
    info,
    account,
    ram,
  };
};

module.exports = init;
