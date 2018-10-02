/* eslint-disable no-console */
const { LOG_CONSOLE, BUGSNAG_API_KEY, SLACK } = require('config');
const bugsnag = require('bugsnag');
const slack = require('slack');

bugsnag.register(BUGSNAG_API_KEY, { appVersion: 1 });

const createSlackNotifier = () => {
  const createOptions = (isError, message) => ({
    token: SLACK.TOKEN,
    channel: SLACK.CHANEL_ID,
    text: `[${new Date()}] [${isError ? 'ERROR' : 'INFO'}] ${message}`,
    icon_url: SLACK.ICON_URL,
    username: SLACK.USERNAME,
  });

  return {
    notify: ({ isError, message }) => {
      slack.chat.postMessage(createOptions(isError, message), (err) => {
        if (err) {
          console.error('Error sending log to slack: ', err);
        }
      });
    },
  };
};

const slackNotifier = createSlackNotifier();

const createLoggerWrapper = () => ({
  info: (data, { send = false } = {}) => {
    if (send) {
      bugsnag.notify(data, { severity: 'info' });
      slackNotifier.notify({ isError: false, message: data });
    }
    if (LOG_CONSOLE || send) {
      console.log(data);
    }
  },
  error: (data, { send = true } = {}) => {
    if (send) {
      bugsnag.notify(data, { severity: 'error' });
      slackNotifier.notify({ isError: true, message: data });
    }
    console.error(data);
  },
});

module.exports = {
  createLogger: createLoggerWrapper,
};
