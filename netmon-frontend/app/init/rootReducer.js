// Core
import { combineReducers } from 'redux';

// Reducers
import { uiReducer as ui } from '../bus/ui/reducer';
import { routeReducer as route } from '../bus/route/reducer';
import { producersReducer as producers } from '../bus/producers/reducer';
import { transactionsReducer as transactions } from '../bus/transactions/reducer';
import { generalStatsReducer as generalStats } from '../bus/generalStats/reducer';
import { modalReducer as modal } from '../bus/modal/reducer';

export default combineReducers({
  ui,
  route,
  producers,
  transactions,
  generalStats,
  modal,
});
