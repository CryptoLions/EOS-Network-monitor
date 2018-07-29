const request = require('request-promise-native');

const { createLogger } = require('../../helpers');

const { info: logInfo, error: logError } = createLogger('UPDATE_PRODUCES:GET_BP_JSON');

const getBPjson = async (helpers, producer, bpUrl) => {
  const url = `${bpUrl}/bp.json`;
  try {
    const body = await request({ url, json: false, timeout: 80000, rejectUnauthorized: false });
    logInfo('SUCCESS');
    const correctedBody = body.indexOf('{') > 0
      ? body.substr(body.indexOf('{'))
      : body;

    return JSON.parse(correctedBody);
  } catch (e) {
    logError('ERROR');
    return undefined;
  }
};

module.exports = getBPjson;
