const corsOptionsDelegate = (whiteList) => (req, callback) => {
  let options;
  let error;
  let origin = req.header('Origin') || req.header('Host');
  if (origin) {
    origin = origin.replace('http://', '').replace('https://', '');
    if (origin.indexOf('/') !== -1) {
      origin = origin.substring(0, origin.indexOf('/'));
    }
    if (origin.indexOf('?') !== -1) {
      origin = origin.substring(0, origin.indexOf('?'));
    }
  } else {
    origin = '';
  }
  if (whiteList.indexOf(origin) !== -1) {
    options = { origin: true };
    error = null;
  } else {
    options = { origin: false };
    error = 'Not allowed';
  }
  callback(error, options);
};

module.exports = corsOptionsDelegate;
