import bugsnag from 'bugsnag-js';

const bugsnagClient = bugsnag({
  apiKey: 'aa95be079e1a1e1f218e9d6f0b994d8a',
  notifyReleaseStages: ['production'],
});

export default bugsnagClient;
