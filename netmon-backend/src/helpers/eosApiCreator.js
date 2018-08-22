const { NODE, RESERVE_NODES, EOS: { GET_INFO_API_PATH } } = require('config');
const EosApi = require('eosjs-api');
const request = require('request-promise-native');

const { info: logInfo } = require('./logger').createLogger();

module.exports = ({ host = NODE.HOST, port = NODE.PORT } = {}) => {
  const isVariable = host === NODE.HOST && port === NODE.PORT;
  const logger = { // Default logging functions
    log: () => {},
    error: () => {},
  };
  const nodes = [NODE].concat(RESERVE_NODES);

  let currentNodeIndex = 0;
  let eos = EosApi({ httpEndpoint: `${host}:${port}`, logger });

  const changeNode = () => {
    currentNodeIndex += 1;
    if (currentNodeIndex >= nodes.length) {
      currentNodeIndex = 0;
    }
    const currentNode = nodes[currentNodeIndex];
    if (!currentNode) {
      return;
    }
    eos = EosApi({ httpEndpoint: `${currentNode.HOST}:${currentNode.PORT}`, logger });
    logInfo(`Node was changed on ${currentNode.HOST}:${currentNode.PORT}`);
  };
  const getInfo = async (args = {}) => {
    let res;
    try {
      const startTs = Date.now();
      res = await eos.getInfo(args);
      if ((Date.now() - startTs) > NODE.ALLOWABLE_MAX_PING) {
        changeNode();
      }
    } catch (e) {
      try {
        if (isVariable) {
          changeNode();
          res = await getInfo(args);
          return res;
        }
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
  };
  const getBlock = async (args) => {
    const startTs = Date.now();
    try {
      const res = await eos.getBlock(args);
      if ((Date.now() - startTs) > NODE.ALLOWABLE_MAX_PING) {
        changeNode();
      }
      return res;
    } catch (e) {
      if (isVariable) {
        changeNode();
        return getBlock(args);
      }
      return getBlock(args);
    }
  };
  return {
    ...eos,
    getBlock,
    getInfo,
  };
};
