const {
  correctBpUrl,
  correctApiUrl,
  correctP2PUrl,
  correctSslUrl,
} = require('./urlCorrector');

const { createLogger } = require('./logger');

const { exec } = require('./childProcessWrapper');

const createEosApi = require('./eosApiCreator');

const castToInt = require('./castToInt');

module.exports = {
  correctBpUrl,
  correctApiUrl,
  correctP2PUrl,
  correctSslUrl,
  createLogger,
  createEosApi,
  exec,
  castToInt,
};
