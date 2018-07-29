import { URL } from '../../constants';
import types from './types';

export const producerActions = Object.freeze({
  fetchProducers: () => async dispatch => {
    const response = await fetch(`${URL}/api/v1/table`);
    const producers = await response.json();

    return dispatch({
      type: types.FETCH_PRODUCERS_SUCCESS,
      payload: {
        producers,
      },
    });
  },

  producersUpdate: data => ({
    type: types.PRODUCERS_UPDATE,
    payload: {
      data,
    },
  }),

  toggleProducerSelection: producerName => ({
    type: types.TOGGLE_PRODUCER_SELECTION,
    payload: producerName,
  }),

  // Filter input value
  setFilterInputValue: filterInputValue => ({
    type: types.SET_FILTER_INPUT_VALUE,
    payload: filterInputValue,
  }),
});
