/* eslint-disable no-mixed-operators */
const { createEosApi } = require('../../helpers');

const initAccountHandler = () => ({
  async getAccount(account_name) {
    const api = createEosApi();
    const account = await api.getAccount({ account_name });
    const balances = await api.getCurrencyBalance('eosio.token', account_name);
    return { ...account, balance: balances && balances[0] || '0.0 EOS' };
  },
});

module.exports = initAccountHandler;
