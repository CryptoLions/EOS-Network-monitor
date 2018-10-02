const { EOS: { GET_INFO_API_PATH } } = require('config');
const request = require('request-promise-native');
const flatten = require('lodash/flatten');

const { createLogger } = require('../../helpers');
const { ProducerModelV2 } = require('../../db');

const { error: logError, info: logInfo } = createLogger();

const getEndpoints = ({ nodes }) => flatten(
  nodes.map(n => {
    const { http_server_address, https_server_address } = n;
    const result = [];
    if (http_server_address && http_server_address.length) {
      result.push(`http://${http_server_address + GET_INFO_API_PATH}`);
    }
    if (https_server_address && https_server_address.length) {
      result.push(`https://${https_server_address + GET_INFO_API_PATH}`);
    }
    return result;
  }),
);

const checkEndpointAvailability = async (url) => {
  try {
    const options = {
      resolveWithFullResponse: true,
      url,
      timeout: 1000 * 60 * 3,
    };
    const { statusCode, statusMessage } = await request(options);
    return statusCode === 200 && statusMessage === 'OK';
  } catch (e) {
    return false;
  }
};

module.exports = async () => {
  try {
    const tsStart = Date.now();
    const producers = await ProducerModelV2
      .find({})
      .sort({ total_votes: -1 })
      .select('name url nodes');

    const bulkWriteOptions = await Promise.all(producers.map(async p => {
      const isSiteAvailable = await checkEndpointAvailability(p.url);
      const endpoints = await Promise.all(getEndpoints(p).map(async e => ({
        endpoint: e,
        isWorking: await checkEndpointAvailability(e),
      })));
      return {
        updateOne: {
          filter: { name: p.name },
          update: { isSiteAvailable, endpoints },
        },
      };
    }));
    if (!bulkWriteOptions.length) {
      return;
    }
    await ProducerModelV2.bulkWrite(bulkWriteOptions);
    logInfo(`Sites and endpoints of producers were checked. Time: ${Date.now() - tsStart}ms`);
  } catch (e) {
    logError(e);
  }
};
