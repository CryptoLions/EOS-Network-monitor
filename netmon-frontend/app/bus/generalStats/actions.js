import types from './types';

export const generalStatsActions = Object.freeze({
  lastBlockStatsUpdate: data => ({
    type: types.LAST_BLOCK_STATS_UPDATE,
    payload: data,
  }),

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
