import { createSelector } from 'reselect';

const selectGeneralStats = () => ({ generalStats }) => generalStats;

export const selectTpsApsStats = () => createSelector(selectGeneralStats(), ({ tpsApsStats }) => tpsApsStats);

export const selectConnectedUsers = () => createSelector(selectGeneralStats(), ({ connectedUsers }) => connectedUsers);

export const selectLastBlockStats = () => createSelector(selectGeneralStats(), ({ lastBlockStats }) => lastBlockStats);

export const selectHeadBlockNum = () =>
  createSelector(selectGeneralStats(), ({ lastBlockStats }) => lastBlockStats.head_block_num);
