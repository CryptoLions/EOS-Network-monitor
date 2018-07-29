import types from './types';

export const transactionActions = Object.freeze({
  transactionsAdd: data => ({
    type: types.TRANSACTIONS_ADD,
    payload: data,
  }),
});
