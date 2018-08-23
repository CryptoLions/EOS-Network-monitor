// Instruments
import types from './types';
import { URL, HISTORY_ITEMS_PER_PAGE, EOS } from '../../constants';

export const modalActions = Object.freeze({
  fetchAccountInfo: producerName => async dispatch => {
    dispatch({ type: types.FETCHING_ACCOUNT_INFO });

    const response = await fetch(`${URL}/api/v1/accounts/${producerName}`);
    const data = await response.json();
    return dispatch({
      type: types.FETCHING_ACCOUNT_INFO_SUCCESS,
      payload: data,
    });
  },

  fetchAccountHistory: (producerName, page) => async dispatch => {
    dispatch({ type: types.FETCHING_ACCOUNT_HISTORY });
    const response = await fetch(
      `${URL}/api/v1/accounts/${producerName}/history?skip=${HISTORY_ITEMS_PER_PAGE *
        page}&limit=${HISTORY_ITEMS_PER_PAGE}`
    );
    const data = await response.json();
    return dispatch({
      type: types.FETCHING_ACCOUNT_HISTORY_SUCCESS,
      payload: data,
    });
  },

  fetchBlockInfo: blockNum => async dispatch => {
    dispatch({ type: types.FETCHING_BLOCK_INFO });

    const response = await EOS.getBlock(blockNum);

    return dispatch({
      type: types.FETCHING_BLOCK_INFO_SUCCESS,
      payload: response,
    });
  },

  fetchTxInfo: txId => async dispatch => {
    dispatch({ type: types.FETCHING_TX_INFO });

    const response = await fetch(`${URL}/api/v1/transactions/${txId}`);
    const data = await response.json();

    return dispatch({
      type: types.FETCHING_TX_INFO_SUCCESS,
      payload: data,
    });
  },
});
