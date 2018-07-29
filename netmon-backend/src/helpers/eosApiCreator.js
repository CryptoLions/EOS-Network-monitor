const { NODE, EOS: { GET_INFO_API_PATH } } = require('config');
const EosApi = require('eosjs-api');
const request = require('request-promise-native');

module.exports = ({ host = NODE.HOST, port = NODE.PORT } = {}) => {
  const eos = EosApi({
    httpEndpoint: `${host}:${port}`,
    logger: { // Default logging functions
      log: () => {},
      error: () => {},
    },
  });
  return {
    ...eos,
    getInfo: async (args = {}) => {
      let res;
      try {
        res = await eos.getInfo(args);
      } catch (e) {
        try {
          const url = `${host}:${port}${GET_INFO_API_PATH}`;
          const options = {
            url,
            headers: {
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
              'Accept-Encoding': 'gzip, deflate, br',
              'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
              'Cache-Control': 'max-age=0',
              Connection: 'keep-alive',
              Host: `${host}:${port}`,
              'Upgrade-Insecure-Requests': 1,
              'User-Agent': 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
            },
            json: true,
            timeout: 80000,
            rejectUnauthorized: false,
          };
          res = await request(options);
        } catch (err) {
          throw err;
        }
      }
      return res;
    },
  };
};
