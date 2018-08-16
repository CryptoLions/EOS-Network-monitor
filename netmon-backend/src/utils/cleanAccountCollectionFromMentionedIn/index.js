const { AccountModelV2 } = require('../../db');
const { createLogger } = require('../../helpers');

const { info: logInfo } = createLogger();

const clean = async () => {
  logInfo('Start cleaning');
  await AccountModelV2.updateMany({ }, { $unset: { mentionedIn: '' } }).exec();
  logInfo('The Account collection was successfully cleaned from the mentionedIn field!');
};

module.exports = clean;
