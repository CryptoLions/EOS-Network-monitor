// Core
import store from 'store';

// Instruments
import types from './types';

export const uiActions = Object.freeze({
  // Modal
  setModalDataFetchingState: modalDataFetchingState => ({
    type: types.SET_MODAL_DATA_FETCHING_STATE,
    payload: modalDataFetchingState,
  }),

  toggleModal: (type, data) => ({
    type: types.SET_MODAL_STATE,
    payload: {
      type,
      data,
    },
  }),

  // Table
  setTableColumnState: columnName => ({
    type: types.SET_TABLE_COLUMN_STATE,
    payload: columnName,
  }),

  resetColumnsVisibility: () => ({
    type: types.RESET_COLUMNS_VISIBILITY,
  }),

  // Background init
  setActualBackgroundNumber: backgroundNumber => {
    store.set('actualBackgroundNumber', backgroundNumber);
    return {
      type: types.SET_ACTUAL_BACKGROUND_NUMBER,
      payload: backgroundNumber,
    };
  },
});
