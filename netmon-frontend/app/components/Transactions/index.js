// Core
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

// Selectors
import { selectTransactionsList } from '../../bus/transactions/selectors';

// Utils
import { stringHandler } from '../../utils/stringHandler';

// Actions
import { uiActions } from '../../bus/ui/actions';

// Styles
import { Container, Table, TableHead, THData, TRow, Link, TData, NewLineSpan } from './styles';

const mapStateToProps = createStructuredSelector({
  transactionsList: selectTransactionsList(),
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
export default class Transactions extends PureComponent {
  toggleAccountInfoModal = e => this.props.actions.toggleModal('accountInfo', e.target.textContent);

  render() {
    const {
      transactionsList,
      actions: { toggleModal },
    } = this.props;

    return (
      <Container>
        <Table>
          <TableHead>
            <tr>
              <THData>#</THData>
              <THData>Who</THData>
              <THData>Action</THData>
              <THData>Data</THData>
            </tr>
          </TableHead>
          <tbody>
            {transactionsList.map(({ c1, c2, c3, c4, c5, c6, uniqId }) => (
              <TRow key={uniqId}>
                <TData>
                  <Link onClick={() => toggleModal('blockInfo', c1)}>{c1}</Link>
                </TData>
                <TData>{stringHandler(c3, this.toggleAccountInfoModal)}</TData>
                <TData>{c2}</TData>
                {c4 === '->' || c4 === '>' ? (
                  <TData>
                    {c5 && <NewLineSpan>{stringHandler(c5, this.toggleAccountInfoModal)}</NewLineSpan>}
                    {c6 && <span>{c6}</span>}
                  </TData>
                ) : (
                  <TData>
                    {c4 && <NewLineSpan>{stringHandler(c4, this.toggleAccountInfoModal)}</NewLineSpan>}
                    {c5 && <NewLineSpan>{stringHandler(c5, this.toggleAccountInfoModal)}</NewLineSpan>}
                    {c6 && <span>{c6}</span>}
                  </TData>
                )}
              </TRow>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}

Transactions.propTypes = {
  transactionsList: PropTypes.array,
  actions: PropTypes.object,
};
