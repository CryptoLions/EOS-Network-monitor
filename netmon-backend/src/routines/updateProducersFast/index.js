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
        filter: { name: p.owner },
        update: { total_votes: p.total_votes, unpaid_blocks: p.unpaid_blocks, isActive: true },
      },
    }));
    await ProducerModelV2.bulkWrite(bulkWriteOptions);
    await ProducerModelV2.updateMany({ name: { $nin: producers.map(p => p.owner) } }, { isActive: false }).exec();
    logInfo('producers positions updated');
  } catch (e) {
    logError(e);
  }
};
