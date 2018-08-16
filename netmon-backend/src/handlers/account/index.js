/* eslint-disable no-mixed-operators */
const { eosApi } = require('../../helpers');

const initAccountHandler = () => ({
  async getAccount(account_name) {
    const account = await eosApi.getAccount({ account_name });
    const balances = await eosApi.getCurrencyBalance('eosio.token', account_name);
    return { ...account, balance: (balances && balances[0]) || '0.0 EOS' };
  },
});

module.exports = initAccountHandler;
