import types from './types';

const initialState = {
  lastBlockStats: {},
  tpsApsStats: {
    stackedTotal: null,
    maxTps: 0,
    liveTps: 0,
    maxAps: 0,
    liveAps: 0,
  },
  connectedUsers: 0,
};

export const generalStatsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.LAST_BLOCK_STATS_UPDATE:
      return {
        ...state,
        lastBlockStats: {
          ...state.lastBlockStats,
          ...payload,
        },
      };

    case types.TOTAL_STACKED_UPDATE:
      return {
        ...state,
        tpsApsStats: {
          ...state.tpsApsStats,
          stackedTotal: payload / 10000,
        },
      };

    case types.TPS_APS_STATS_UPDATE:
      return {
        ...state,
        tpsApsStats: {
          ...state.tpsApsStats,
          totalProcessedBlocks: payload.block_num,
          maxTps: payload.max_tps,
          maxTpsBlock: payload.max_tps_block,
          liveTps: payload.live_tps,
          maxAps: payload.max_aps,
          liveAps: payload.live_aps,
        },
      };

    case types.CONNECTED_USERS_UPDATE:
      return {
        ...state,
        connectedUsers: payload,
      };
    default:
      return state;
  }
};
