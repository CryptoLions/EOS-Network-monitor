// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

// Socket
import socket from '../../../../init/socket';

// Components
import TransactionRow from './TransactionRow';

// Utils
import renderEnhancer from '../../../../hoc/renderEnhancer';

// Svg
import { SvgPlayPause, SvgSpinner } from '../svg';

// Styles
import { Wrapper, Header, HeaderSpan, Container, TextSpan, GreenSpan } from '../styles';
import { HeadDiv, OverflowContainer } from './styles';

@translate()
class Transactions extends PureComponent {
  state = {
    isTransactionsSocketOn: true,
  };

  toggleTransactionsSocketOn = () =>
    this.setState(
      ({ isTransactionsSocketOn }) => ({ isTransactionsSocketOn: !isTransactionsSocketOn }),
      () => (this.state.isTransactionsSocketOn ? socket.emitTransactionsSocketOn() : socket.emitTransactionsSocketOff())
    );

  toggleAccountInfoModal = e => this.props.toggleModal('accountInfo', e.target.textContent);

  render() {
    const { isTransactionsSocketOn } = this.state;
    const { t, transactionsInfo = {}, toggleModal, transactionsList } = this.props;

    return (
      <Wrapper>
        <Header>
          <HeaderSpan>{t('i18nFirstSection.i18nTransactions.title')}</HeaderSpan>
          <SvgPlayPause
            toggleTransactionsSocketOn={this.toggleTransactionsSocketOn}
            isTransactionsSocketOn={isTransactionsSocketOn}
          />
        </Header>
        <Container>
          {transactionsInfo.totalBlockCount ? (
            <Fragment>
              <HeadDiv>
                <TextSpan>
                  {t('i18nFirstSection.i18nTransactions.total')}:{' '}
                  <GreenSpan>{transactionsInfo.totalTransactionsCount}</GreenSpan>{' '}
                  {t('i18nFirstSection.i18nTransactions.transactions')}
                </TextSpan>
                <TextSpan>
                  in <GreenSpan>{transactionsInfo.notEmptyBlocksCount}</GreenSpan> blocks
                </TextSpan>
                <TextSpan>
                  {t('i18nFirstSection.i18nTransactions.blockNumber')}:{' '}
                  <GreenSpan>{transactionsInfo.totalBlockCount}</GreenSpan>
                </TextSpan>
              </HeadDiv>
              <OverflowContainer>
                {transactionsList.slice(0, 10).map((transaction, i) => (
                  <TransactionRow
                    transaction={transaction}
                    key={transaction.txid}
                    iteration={i}
                    toggleModal={toggleModal}
                  />
                ))}
              </OverflowContainer>
            </Fragment>
          ) : (
            <SvgSpinner />
          )}
        </Container>
      </Wrapper>
    );
  }
}

Transactions.propTypes = {
  t: PropTypes.func,
  transactionsList: PropTypes.array,
  transactionsInfo: PropTypes.object,
  toggleModal: PropTypes.func,
};

export default renderEnhancer(Transactions);
