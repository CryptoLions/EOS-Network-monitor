// Core
import store from 'store';

import types from './types';

const initialState = {
  producers: [],
  top21Producer: [],
  selectedProducers: store.get('checkedProducers') || [],
  // Filter input value
  filterInputValue: '',
};

export const producersReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.FETCH_PRODUCERS_SUCCESS:
      return {
        ...state,
        producers: payload.producers,
        top21Producer: payload.producers
          .slice(0, 21)
          .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
      };
    case types.PRODUCERS_UPDATE:
      if (!payload.data || !payload.data.length) {
        return state;
      }

      return {
        ...state,
        producers: state.producers.map(producer => {
          const nextProducerData = payload.data.find(changedProducer => producer.name === changedProducer.name);
          return nextProducerData || producer;
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
