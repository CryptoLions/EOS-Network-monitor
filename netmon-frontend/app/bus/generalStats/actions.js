import types from './types';

export const generalStatsActions = Object.freeze({
  lastBlockStatsUpdate: data => (dispatch, getState) => {
    const { top21Producer } = getState().producers;
    const currentProducerIndex = top21Producer.findIndex(producer => producer.name === data.head_block_producer);

    let nextProducerIndex = -1;
    if (currentProducerIndex > -1) {
      nextProducerIndex = currentProducerIndex === 20 ? 0 : currentProducerIndex + 1;
    }
    return dispatch({
      type: types.LAST_BLOCK_STATS_UPDATE,
      payload: {
        nextProducer: nextProducerIndex === -1 ? '' : top21Producer[nextProducerIndex].name,
        data,
      },
    });
  },

  tpsApsStatsUpdate: data => ({
    type: types.TPS_APS_STATS_UPDATE,
    payload: data,
  }),

  totalStackedUpdate: data => ({
    type: types.TOTAL_STACKED_UPDATE,
    payload: data,
  }),

  connectedUsersUpdate: data => ({
    type: types.CONNECTED_USERS_UPDATE,
    payload: data,
  }),
});
