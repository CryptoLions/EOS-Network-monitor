// Types
import types from './types';

const initialState = {
  accountInfo: {},
  accountHistory: {},
  blockInfo: {},
  txInfo: {},
};

export const modalReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.FETCHING_ACCOUNT_INFO_SUCCESS:
      return {
        ...state,
        accountInfo: payload,
      };

    case types.FETCHING_ACCOUNT_HISTORY_SUCCESS:
      return {
        ...state,
        accountHistory: payload,
      };

    case types.FETCHING_BLOCK_INFO_SUCCESS:
      return {
        ...state,
        blockInfo: payload,
      };

    case types.FETCHING_TX_INFO_SUCCESS:
      return {
        ...state,
        txInfo: payload,
      };

    default:
      return state;
  }
};
