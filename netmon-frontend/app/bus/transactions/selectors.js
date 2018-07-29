import { createSelector } from 'reselect';

const selectTransactions = () => ({ transactions }) => transactions;

export const selectTransactionsList = () =>
  createSelector(selectTransactions(), ({ transactionsList }) => transactionsList);

export const selectTransactionsInfo = () =>
  createSelector(selectTransactions(), ({ transactionsInfo }) => transactionsInfo);
