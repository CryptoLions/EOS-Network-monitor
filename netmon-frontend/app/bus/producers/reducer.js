// Core
import store from 'store';

import types from './types';

const initialState = {
  producers: [],
  selectedProducers: store.get('checkedProducers') || [],
  // Filter input value
  filterInputValue: '',
};

export const producersReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.FETCH_PRODUCERS_SUCCESS:
      return {
        ...state,
        producers: payload.producers.map((producer, index) => ({ ...producer, index })),
      };

    case types.PRODUCERS_UPDATE:
      if (!payload.data || !payload.data.length) {
        return state;
      }

      return {
        ...state,
        producers: state.producers.map(producer => {
          const nextProducerData = payload.data.find(changedProducer => producer.name === changedProducer.name);
          return nextProducerData ? { ...nextProducerData, index: producer.index } : producer;
        }),
      };

    case types.TOGGLE_PRODUCER_SELECTION:
      if (!state.selectedProducers.some(item => item === payload))
        return {
          ...state,
          selectedProducers: [...state.selectedProducers, payload],
        };

      return {
        ...state,
        selectedProducers: state.selectedProducers.filter(item => item !== payload),
      };

    // Filter input value
    case types.SET_FILTER_INPUT_VALUE:
      return {
        ...state,
        filterInputValue: payload,
      };

    default:
      return state;
  }
};
