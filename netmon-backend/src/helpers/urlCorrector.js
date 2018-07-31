/* eslint-disable no-param-reassign */
const removeLastSlashIfExist = url => url && (url.substr(url.length - 1, 1) === '/'
  ? url.substr(0, url.length - 1)
  : url);

const removeHttpAndHttpsIfExist = url => url && url
  .replace('https://', '')
  .replace('http://', '');

const correctBpUrl = url => {
  if (!url || url.length < 1) {
    return url;
  }
  if (url.indexOf('http') < 0 && url.length > 0) {
    url = `http://${url}`;
  }
  return removeLastSlashIfExist(url);
};

const correctP2PUrl = url => {
  url = removeHttpAndHttpsIfExist(url);
  url = removeLastSlashIfExist(url);
  if (url && url.length > 0 && url.indexOf(':') < 6) {
    if (url.indexOf('https') >= 0) {
      url += ':443';
    } else {
      url += ':80';
    }
  }
  return url;
};

const correctSslUrl = url => {
  url = removeHttpAndHttpsIfExist(url);
  url = removeLastSlashIfExist(url);
  if (url && url.length > 0 && url.indexOf(':') < 6) {
    url += ':443';
    return url;
  }
  return null;
};

const correctApiUrl = url => {
  url = removeHttpAndHttpsIfExist(url);
  url = removeLastSlashIfExist(url);
  if (url && url.length > 0 && url.indexOf(':') < 6) {
    url += ':80';
  }
  return url;
};

module.exports = {
  correctBpUrl,
  correctApiUrl,
  correctP2PUrl,
  correctSslUrl,
};
