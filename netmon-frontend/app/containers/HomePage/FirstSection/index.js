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
import { selectLastBlockStats } from '../../../bus/generalStats/selectors';
import { selectTransactionsList, selectTransactionsInfo } from '../../../bus/transactions/selectors';

// Styles
import { SectionOne } from './styles';

const mapStateToProps = createStructuredSelector({
  // CurrentBlockInfo
  lastBlockStats: selectLastBlockStats(),
  // GeneralInfo
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
      // additionalInfoStats,
      // Transactions
      transactionsList,
      transactionsInfo,
      actions: { toggleModal },
    } = this.props;

    return (
      <SectionOne>
        <CurrentBlockInfo lastBlockStats={lastBlockStats} />
        <GeneralInfo toggleModal={toggleModal} />
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
  // Transactions
  transactionsList: PropTypes.array,
  transactionsInfo: PropTypes.object,
  actions: PropTypes.object,
};
