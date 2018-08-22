const request = require('request-promise-native');

const { createLogger } = require('../../helpers');
const { ProducerModelV2 } = require('../../db');

const { error: logError } = createLogger();

const checkSiteAvailability = async ({ url }) => {
  try {
    const options = {
      resolveWithFullResponse: true,
      url,
      timeout: 60000,
    };
    const { statusCode, statusMessage } = await request(options);
    return statusCode === 200 && statusMessage === 'OK';
  } catch (e) {
    return false;
  }
};

module.exports = async () => {
  try {
    const producers = await ProducerModelV2
      .find({})
      .select('name url');

    const bulkWriteOptions = await Promise.all(producers.map(async p => {
      const isSiteAvailable = await checkSiteAvailability(p);
      return {
        updateOne: {
          filter: p,
          update: { isSiteAvailable },
        },
      };
    }));
    return bulkWriteOptions.length
      ? ProducerModelV2.bulkWrite(bulkWriteOptions)
      : undefined; // when the producers collection is empty
  } catch (e) {
    logError(e);
    return undefined;
  }
};
