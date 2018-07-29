import { createSelector } from 'reselect';

const selectModal = () => ({ modal }) => modal;

export const selectAccountInfo = () => createSelector(selectModal(), ({ accountInfo }) => accountInfo);

export const selectAccountHistory = () => createSelector(selectModal(), ({ accountHistory }) => accountHistory);

export const selectBlockInfo = () => createSelector(selectModal(), ({ blockInfo }) => blockInfo);

export const selectTxIdInfo = () => createSelector(selectModal(), ({ txInfo }) => txInfo);
