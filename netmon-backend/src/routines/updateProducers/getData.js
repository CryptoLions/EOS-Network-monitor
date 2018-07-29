const { createLogger, createEosApi } = require('../../helpers');

const { info: logInfo, error: logError } = createLogger('UPDATE_PRODUCES:GET_DATA');
const eosApi = createEosApi();


const getData = async () => {
  try {
    const producersSystem = await eosApi.getProducers({ json: true, limit: 1000 });
    logInfo('SUCCESS');
    return producersSystem.rows;
  } catch (e) {
    logError('FAIL');
    throw e;
  }
};

module.exports = getData;
