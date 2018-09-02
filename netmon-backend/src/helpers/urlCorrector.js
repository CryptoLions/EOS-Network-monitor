const parse = require('url-parse');

/* eslint-disable no-param-reassign */
const removeLastSlashIfExist = url =>
  url && (url.substr(url.length - 1, 1) === '/' ? url.substr(0, url.length - 1) : url);

const addProtocol = (url = '') => (url.startsWith('http') ? url : `http://${url}`);

const correctBpUrl = url => {
  if (!url || url.length < 1) {
    return url;
  }
  let correctedUrl = url;
  if (correctedUrl.indexOf('http') < 0 && correctedUrl.length > 0) {
    correctedUrl = `http://${correctedUrl}`;
  }
  correctedUrl = removeLastSlashIfExist(correctedUrl);
  if (correctedUrl === 'http://www.zbeos.com') {
    correctedUrl = 'https://www.zbeos.com';
  }
  return correctedUrl;
};

const correctP2PUrl = url => {
  const parsed = parse(addProtocol(url));
  if (!parsed.host) {
    return null;
  }
  if (parsed.port) {
    return parsed.host;
  }

  return `${parsed.host}${parsed.protocol === 'http:' ? '80' : ':443'}`;
};

const correctSslUrl = url => {
  const parsed = parse(addProtocol(url));
  if (!parsed.host) {
    return null;
  }
  return `${parsed.host}${parsed.port ? '' : ':443'}`;
};

const correctApiUrl = url => {
  const parsed = parse(addProtocol(url));
  if (!parsed.host) {
    return null;
  }
  return `${parsed.host}${parsed.port ? '' : ':80'}`;
};

module.exports = {
  correctBpUrl,
  correctApiUrl,
  correctP2PUrl,
  correctSslUrl,
};
