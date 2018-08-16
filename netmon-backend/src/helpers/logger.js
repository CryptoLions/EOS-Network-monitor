const { LOG_CONSOLE, BUGSNAG_API_KEY } = require('config');
const bugsnag = require('bugsnag');

bugsnag.register(BUGSNAG_API_KEY, { appVersion: 1 });

const createLoggerWrapper = () => ({
  info: (data, { send = false } = {}) => {
    if (send) {
      bugsnag.notify(data, { severity: 'info' });
    }
    if (LOG_CONSOLE) {
      console.log(data);
    }
  },
  error: (data, { send = true } = {}) => {
    if (send) {
      bugsnag.notify(data, { severity: 'error' });
    }
    if (LOG_CONSOLE) {
      console.error(data);
    }
  },
});

module.exports = {
  createLogger: createLoggerWrapper,
};
