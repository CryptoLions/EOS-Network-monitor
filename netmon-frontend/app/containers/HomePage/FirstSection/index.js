// Core
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

// Components
import CurrentBlockInfo from './CurrentBlockInfo';
import GeneralInfo from './GeneralInfo';
import Transactions from './Transactions';

// Actions
import { uiActions } from '../../../bus/ui/actions';

// Selectors
import { selectLastBlockStats, selectTpsApsStats, selectConnectedUsers } from '../../../bus/generalStats/selectors';
import { selectTransactionsList, selectTransactionsInfo } from '../../../bus/transactions/selectors';

// Styles
import { SectionOne } from './styles';

const mapStateToProps = createStructuredSelector({
  // CurrentBlockInfo
  lastBlockStats: selectLastBlockStats(),
  // GeneralInfo
  tpsApsStats: selectTpsApsStats(),
  connectedUsers: selectConnectedUsers(),
  // Transactions
  transactionsList: selectTransactionsList(),
  transactionsInfo: selectTransactionsInfo(),
});

const mapDispatchToProps = dispach => ({
  actions: bindActionCreators(
    {
      toggleModal: uiActions.toggleModal,
    },
    dispach
  ),
});

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class FirstSection extends PureComponent {
  render() {
    const {
      // CurrentBlockInfo
      lastBlockStats,
      // GeneralInfo
      tpsApsStats,
      connectedUsers,
      // Transactions
      transactionsList,
      transactionsInfo,
      actions: { toggleModal },
    } = this.props;

    return (
      <SectionOne>
        <CurrentBlockInfo lastBlockStats={lastBlockStats} />
        <GeneralInfo tpsApsStats={tpsApsStats} connectedUsers={connectedUsers} toggleModal={toggleModal} />
        <Transactions
          transactionsList={transactionsList}
          transactionsInfo={transactionsInfo}
          toggleModal={toggleModal}
        />
      </SectionOne>
    );
  }
}

FirstSection.propTypes = {
  // CurrentBlockInfo
  lastBlockStats: PropTypes.object,
  // GeneralInfo
  tpsApsStats: PropTypes.object,
  connectedUsers: PropTypes.number,
  // Transactions
  transactionsList: PropTypes.array,
  transactionsInfo: PropTypes.object,
  actions: PropTypes.object,
};
