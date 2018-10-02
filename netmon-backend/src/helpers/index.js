const { correctBpUrl, correctApiUrl, correctP2PUrl, correctSslUrl } = require('./urlCorrector');

const { createLogger } = require('./logger');

const { exec } = require('./childProcessWrapper');

const createEosApi = require('./eosApiCreator');

const castToInt = require('./castToInt');

const pickAs = require('./pickAs');

const setSensitiveInterval = require('./setSensitiveInterval');

const { info: logInfo, error: logError } = createLogger();

module.exports = {
  correctBpUrl,
  correctApiUrl,
  correctP2PUrl,
  correctSslUrl,
  createLogger,
  logInfo,
  logError,
  createEosApi,
  eosApi: createEosApi(),
  exec,
  castToInt,
  pickAs,
  setSensitiveInterval,
};
