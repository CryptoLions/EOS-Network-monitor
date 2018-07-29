import types from './types';

import { TRANSACTIONS_LIMIT } from '../../constants';
import { stripHtml } from '../../utils/stringUtils';

const initialState = {
  transactionsList: [],
  transactionsInfo: {},
};

export const transactionsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.TRANSACTIONS_ADD:
      return {
        ...state,
        transactionsList: [
          ...payload.transactions.slice(0, TRANSACTIONS_LIMIT).map(transaction => ({
            ...transaction,
            c3: stripHtml(transaction.c3),
            c4: stripHtml(transaction.c4),
            c5: stripHtml(transaction.c5),
            c6: stripHtml(transaction.c6),
          })),
          ...(payload.transactions.length > TRANSACTIONS_LIMIT
            ? []
            : state.transactionsList.slice(0, TRANSACTIONS_LIMIT - payload.transactions.length)),
        ],
        transactionsInfo: {
          totalTransactionsCount: payload.totalTransactionsCount,
          notEmptyBlocksCount: payload.notEmptyBlocksCount,
          totalBlockCount: payload.totalBlockCount,
        },
      };
    default:
      return state;
  }
};
