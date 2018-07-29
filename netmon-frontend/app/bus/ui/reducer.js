// Core
import store from 'store';

// Types
import types from './types';
import modalTypes from '../modal/types';

const DEFAULT_COLUMNS_STATE = {
  ping: true,
  name: true,
  answered: true,
  block: true,
  produced: false,
  block2: false,
  version: true,
  address: false,
  http: false,
  p2p: false,
  location: false,
  blocks: false,
  txs: false,
  organisation: false,
  votes: true,
};

const initialState = {
  modalDataFetchingState: false,
  modal: {
    type: '',
    data: null,
  },
  tableColumnState: store.get('tableColumnState') || DEFAULT_COLUMNS_STATE,
};

export const uiReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.SET_MODAL_STATE:
      return {
        ...state,
        modal: {
          ...payload,
        },
      };

    case types.SET_ACTIVE_TAB_INDEX_STATE:
      return {
        ...state,
        activeTabIndex: payload,
      };

    case types.SET_TABLE_COLUMN_STATE:
      return {
        ...state,
        tableColumnState: {
          ...state.tableColumnState,
          [payload]: !state.tableColumnState[payload],
        },
      };
    case types.RESET_COLUMNS_VISIBILITY:
      return {
        ...state,
        tableColumnState: DEFAULT_COLUMNS_STATE,
      };
    // modal fetching state
    case modalTypes.FETCHING_ACCOUNT_INFO:
    case modalTypes.FETCHING_ACCOUNT_HISTORY:
    case modalTypes.FETCHING_BLOCK_INFO:
    case modalTypes.FETCHING_TX_INFO:
      return {
        ...state,
        modalDataFetchingState: true,
      };
    case modalTypes.FETCHING_ACCOUNT_INFO_SUCCESS:
    case modalTypes.FETCHING_ACCOUNT_HISTORY_SUCCESS:
    case modalTypes.FETCHING_BLOCK_INFO_SUCCESS:
    case modalTypes.FETCHING_TX_INFO_SUCCESS:
      return {
        ...state,
        modalDataFetchingState: false,
      };

    default:
      return state;
  }
};
