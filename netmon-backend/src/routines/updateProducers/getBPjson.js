const request = require('request-promise-native');

const getBPjson = async bpUrl => {
  const url = `${bpUrl}/bp.json`;
  try {
    const body = await request({ url, json: false, timeout: 60000, rejectUnauthorized: false });
    const correctedBody = body.indexOf('{') > 0 ? body.substr(body.indexOf('{')) : body;

    return JSON.parse(correctedBody);
  } catch (e) {
    return undefined;
  }
};

module.exports = getBPjson;
