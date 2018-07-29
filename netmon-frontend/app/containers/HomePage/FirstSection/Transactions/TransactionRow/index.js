// Core
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Utils
import { stringHandler } from '../../../../../utils/stringHandler';

// Styles
import { RowData, Link, ItemContainer, TextSpan } from './styles';

export default class TransactionRow extends PureComponent {
  toggleAccountInfoModal = e => this.props.toggleModal('accountInfo', e.target.textContent);

  toggleBlockInfoModal = () => this.props.toggleModal('blockInfo', this.props.transaction.c1);

  render() {
    const {
      transaction: { c1, c2, c3, c4, c5, c6 },
      iteration,
    } = this.props;

    return (
      <RowData iteration={iteration}>
        <Link onClick={this.toggleBlockInfoModal}>{c1}</Link>
        <ItemContainer>
          <TextSpan>{c2}</TextSpan>
          <TextSpan>{stringHandler(c3, this.toggleAccountInfoModal)}</TextSpan>
          <TextSpan>{stringHandler(c4, this.toggleAccountInfoModal)}</TextSpan>
          <TextSpan>{stringHandler(c5, this.toggleAccountInfoModal)}</TextSpan>
          <TextSpan>{c6}</TextSpan>
        </ItemContainer>
      </RowData>
    );
  }
}

TransactionRow.propTypes = {
  transaction: PropTypes.object,
  toggleModal: PropTypes.func,
  iteration: PropTypes.number,
};
