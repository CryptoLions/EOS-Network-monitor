import io from 'socket.io-client';
import throttle from 'lodash/throttle';

import { URL, THROTTLE_TIMEOUT } from '../constants';
import { producerActions } from '../bus/producers/actions';
import { transactionActions } from '../bus/transactions/actions';
import { generalStatsActions } from '../bus/generalStats/actions';
import { modalActions } from '../bus/modal/actions';
import { uiActions } from '../bus/ui/actions';

class SocketClient {
  init = ({ dispatch, getState }) => {
    this.dispatch = dispatch;
    this.getState = getState;
    this.socket = io(URL);

    this.transactions = [];
  };

  connect() {
    // Transactions
    this.socket.on('transactions', data => this.dispatch(transactionActions.transactionsAdd(data)));

    // Reload producers
    this.socket.on('reload_producers', () => {
      this.dispatch(producerActions.fetchProducers());
    });

    // general stats
    this.socket.on(
      'totalstaked',
      throttle(data => this.dispatch(generalStatsActions.totalStackedUpdate(data)), THROTTLE_TIMEOUT)
    );

    this.socket.on(
      'blockupdate',
      throttle(data => this.dispatch(generalStatsActions.tpsApsStatsUpdate(data)), THROTTLE_TIMEOUT)
    );

    this.socket.on('usersonline', data => this.dispatch(generalStatsActions.connectedUsersUpdate(data)));

    this.socket.on('info', data => {
      this.dispatch(generalStatsActions.lastBlockStatsUpdate(data));
    });

    // Modal
    this.socket.on('api', data => {
      this.dispatch(modalActions.soketFetchingApiResponseSuccess(data));
      this.dispatch(uiActions.setModalDataFetchingState(false));
    });

    this.socket.on('TXinfo_res', data => {
      this.dispatch(modalActions.soketFetchingTxInfoSuccess(data));
      this.dispatch(uiActions.setModalDataFetchingState(false));
    });

    // Debug
    this.socket.on('reload', () => {
      window.location.reload();
    });

    this.socket.on('console', msg => {
      console.log('console', msg);
    });

    this.socket.on('error', msg => {
      console.log('error', msg);
    });

    // setTimeout(() => this.dispatch(producerActions.soketErrorNode(1)), 5000);
    // setTimeout(() => {
    //   console.log('disconnect');
    //   this.socket.disconnect();
    // }, 10000);
  }

  // transactions
  emitTransactionsSocketOn = () =>
    this.socket.on('transactions', data => this.dispatch(transactionActions.transactionsAdd(data)));

  emitTransactionsSocketOff = () => this.socket.off('transactions');

  listenProducerUpdates = () => this.socket.on('table', data => this.dispatch(producerActions.producersUpdate(data)));
}

export default new SocketClient();
