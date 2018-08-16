const request = require('request-promise-native');

const { createLogger } = require('../../helpers');

const { info: logInfo } = createLogger('UPDATE_PRODUCES:GET_BP_JSON');

const getBPjson = async bpUrl => {
  const url = `${bpUrl}/bp.json`;
  try {
    const body = await request({ url, json: false, timeout: 60000, rejectUnauthorized: false });
    const correctedBody = body.indexOf('{') > 0 ? body.substr(body.indexOf('{')) : body;

    return JSON.parse(correctedBody);
  } catch (e) {
    logInfo(e);
    return undefined;
  }
};

module.exports = getBPjson;
