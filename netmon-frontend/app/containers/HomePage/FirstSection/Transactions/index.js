// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

// Socket
import socket from '../../../../init/socket';

// Components
// import TransactionRow from './TransactionRow';

// Utils
import renderEnhancer from '../../../../hoc/renderEnhancer';

// Svg
import { SvgPlayPause, SvgSpinner } from '../svg';

// Styles
import { Wrapper, Header, HeaderSpan, Container, TextSpan, GreenSpan } from '../styles';
import {
  HeadDiv,
  // OverflowContainer,
  SmallText,
} from './styles';

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
    const {
      transactionsList = [],
      transactionsInfo = {},
      // toggleModal
    } = this.props;

    return (
      <Wrapper>
        <Header>
          <HeaderSpan>Transactions</HeaderSpan>
          <SvgPlayPause
            toggleTransactionsSocketOn={this.toggleTransactionsSocketOn}
            isTransactionsSocketOn={isTransactionsSocketOn}
          />
        </Header>
        <Container>
          {transactionsList.length ? (
            <Fragment>
              <HeadDiv>
                {/* <TextSpan>
                  Total: <GreenSpan>{transactionsInfo.totalTransactionsCount}</GreenSpan>
                </TextSpan>
                <TextSpan>
                  Transactions: <GreenSpan>{`in ${transactionsInfo.notEmptyBlocksCount} Blocks`}</GreenSpan>
                </TextSpan> */}
                <TextSpan>
                  Synced up to block #: <GreenSpan>{transactionsInfo.totalBlockCount}</GreenSpan>
                </TextSpan>
                <SmallText>Transactions will appear after synchronization...</SmallText>
              </HeadDiv>
              {/* <OverflowContainer>
                {transactionsList
                  .slice(0, 10)
                  .map((transaction, i) => (
                    <TransactionRow
                      transaction={transaction}
                      key={transaction.txid}
                      iteration={i}
                      toggleModal={toggleModal}
                    />
                  ))}
              </OverflowContainer> */}
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
  transactionsList: PropTypes.array,
  transactionsInfo: PropTypes.object,
  toggleModal: PropTypes.func,
};

export default renderEnhancer(Transactions);
