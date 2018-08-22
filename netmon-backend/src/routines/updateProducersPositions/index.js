/* eslint-disable camelcase,no-plusplus,max-len */
/* ###############################################################################
#
# EOS TestNet Monitor
#
# Created by http://CryptoLions.io
#
# Git Hub: https://github.com/CryptoLions/EOS-Testnet-monitor
#
###############################################################################  */

const { eosApi, createLogger } = require('../../helpers');
const { ProducerModelV2 } = require('../../db');

const { info: logInfo, error: logError } = createLogger();

module.exports = async () => {
  try {
    const { rows: producers } = await eosApi.getProducers({ json: true, limit: 1000 });
    const bulkWriteOptions = producers.map(p => ({
      updateOne: {
        filter: { name: p.bp_name },
        update: { total_votes: p.total_votes },
      },
    }));
    await ProducerModelV2.bulkWrite(bulkWriteOptions);
    logInfo('producers positions updated');
  } catch (e) {
    logError(e);
  }
};
