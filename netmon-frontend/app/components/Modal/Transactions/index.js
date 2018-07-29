// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import store from 'store';

// Components
import LoadingLine from '../../LoadingLine';

// Selectors
import { selectTxIdInfo } from '../../../bus/modal/selectors';
import { selectModalDataFetchingState } from '../../../bus/ui/selectors';

// Utils
import { convertUtcToLocal } from '../../../utils/dateUtils';
import { stripHtml } from '../../../utils/stringUtils';
import { stringHandler } from '../../../utils/stringHandler';

// Actions
import { uiActions } from '../../../bus/ui/actions';
import { modalActions } from '../../../bus/modal/actions';

// Styles
import { InputsDiv, GetButton, Header, HeadContainer, HeadBox, HeadText, Main, Link } from '../styles';
import { TransactionsInput } from './styles';

const mapStateToProps = createStructuredSelector({
  modalDataFetchingState: selectModalDataFetchingState(),
  txIdData: selectTxIdInfo(),
});

const mapDispatchToProps = dispach => ({
  actions: bindActionCreators(
    {
      fetchTxInfo: modalActions.fetchTxInfo,
      toggleModal: uiActions.toggleModal,
    },
    dispach
  ),
});

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class Transactions extends PureComponent {
  state = {
    txId:
      this.props.txId ||
      store.get('modal_transactions') ||
      'aa166ab6fcfc5749dadbcaa05de131fdcd0626b2f9be596e404289e1a825211d',
  };

  componentDidMount() {
    window.location.hash = `transactions:${this.state.txId}`;
    this.getData();
  }

  componentWillUnmount() {
    window.location.hash = ``;
  }

  onTXidChange = e => this.setState({ txId: e.target.value });

  getData = () => {
    const { txId } = this.state;
    if (txId) {
      if (!this.props.modalDataFetchingState) this.props.actions.fetchTxInfo(txId);
      store.set('modal_transactions', txId);
    }
  };

  toggleAccountInfoModal = e => this.props.actions.toggleModal('accountInfo', e.target.textContent);

  render() {
    const { txId } = this.state;
    const {
      modalDataFetchingState,
      txIdData,
      actions: { toggleModal },
    } = this.props;

    return (
      <Fragment>
        <Header>
          <HeadBox>
            <HeadText>TRANSACTION</HeadText>
          </HeadBox>
          <HeadContainer>
            <InputsDiv>
              <TransactionsInput value={txId} placeholder="TX id" onChange={this.onTXidChange} />
              <GetButton onClick={this.getData}>Get</GetButton>
            </InputsDiv>
            <span>Find a Transaction</span>
          </HeadContainer>
        </Header>
        <LoadingLine state={modalDataFetchingState} />
        <Main>
          {!modalDataFetchingState &&
            !!Object.keys(txIdData).length && (
              <Fragment>
                <div>
                  <span>Block:</span>
                  <Link onClick={() => toggleModal('blockInfo', txIdData.msgObject.c1)}>
                    {` #${txIdData.msgObject.c1}`}
                  </Link>
                </div>
                <div>
                  <span>TXid:</span>{' '}
                  <Link onClick={() => toggleModal('transactions', txIdData.txid)}>{txIdData.txid}</Link>
                </div>
                <div>
                  <span>Date:</span> <span>{convertUtcToLocal(txIdData.date)}</span>
                </div>
                <div>
                  <span>Action:</span> <span>{stripHtml(txIdData.msgObject.c2, 'a')}</span>
                </div>
                <div>
                  <span>From:</span>{' '}
                  <Link onClick={() => toggleModal('accountInfo', stripHtml(txIdData.msgObject.c3, 'a'))}>
                    {stripHtml(txIdData.msgObject.c3, 'a')}
                  </Link>
                </div>
                <div>
                  <span>Info:</span>{' '}
                  <span>
                    {txIdData.msgObject.c4 !== '->' &&
                      txIdData.msgObject.c4 !== '>' &&
                      stringHandler(stripHtml(txIdData.msgObject.c4, 'a'), this.toggleAccountInfoModal)}
                    <br />
                    {txIdData.msgObject.c6}
                    <br />
                    {txIdData.msgObject.c5 !== '->' &&
                      txIdData.msgObject.c5 !== '>' &&
                      stripHtml(txIdData.msgObject.c5, 'a')}
                    <br />
                  </span>
                </div>
              </Fragment>
            )}
        </Main>
      </Fragment>
    );
  }
}

Transactions.propTypes = {
  modalDataFetchingState: PropTypes.bool,
  txId: PropTypes.string,
  txIdData: PropTypes.object,
  actions: PropTypes.object,
};
