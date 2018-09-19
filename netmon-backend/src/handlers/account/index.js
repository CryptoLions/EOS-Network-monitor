/* eslint-disable no-mixed-operators */
const { eosApi, createLogger } = require('../../helpers');

const { error: logError } = createLogger();

const initAccountHandler = () => ({
  async getAccount(account_name) {
    try {
      if (!account_name || account_name.length > 13) {
        return {};
      }
      const account = await eosApi.getAccount({ account_name });
      const balances = await eosApi.getCurrencyBalance('eosio.token', account_name);
      return { ...account, balance: (balances && balances[0]) || '0.0 EOS' };
    } catch (e) {
      logError(e);
      return {};
    }
  },
});

module.exports = initAccountHandler;
