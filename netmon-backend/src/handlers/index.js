const initUserCountHandler = require('./userCount');
const initTableHandler = require('./table');
const initTransactionHandler = require('./transaction');
const initTotalStackedHandler = require('./totalStacked');
const initInfoHandler = require('./info');
const initAccountHandler = require('./account');

const init = async () => {
  const userCount = await initUserCountHandler();
  const table = await initTableHandler();
  const transaction = await initTransactionHandler();
  const totalStacked = await initTotalStackedHandler();
  const info = await initInfoHandler();
  const account = await initAccountHandler();

  info.onUpdate(infoData => table.setCurrentInfo(infoData));
  return {
    userCount,
    table,
    totalStacked,
    transaction,
    info,
    account,
  };
};

module.exports = init;
