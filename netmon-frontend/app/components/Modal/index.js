// Core
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import AccountInfo from './AccountInfo';
import AccountHistory from './AccountHistory';
import BlockInfo from './BlockInfo';
import Vote from './Vote';
import Transactions from './Transactions';
import Legend from './Legend';

// Styles
import { ModalWrapper, ModalContainer, Cross } from './styles';

export default class Modal extends PureComponent {
  getModalContent = () => {
    const { type, data } = this.props.modal;

    switch (type) {
      case 'accountInfo':
        return <AccountInfo accountName={data} />;
      case 'accountHistory':
        return <AccountHistory accountName={data} />;
      case 'blockInfo':
        return <BlockInfo data={data} />;
      case 'vote':
        return <Vote data={data} />;
      case 'transactions':
        return <Transactions txId={data} />;
      case 'legend':
        return <Legend />;
      default:
        return null;
    }
  };

  stopPropagation = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  hideModal = () => this.props.toggleModal('', null);

  render() {
    return (
      <ModalWrapper onClick={this.hideModal}>
        <ModalContainer onClick={this.stopPropagation}>
          <Cross onClick={this.hideModal} />
          {this.getModalContent()}
        </ModalContainer>
      </ModalWrapper>
    );
  }
}

Modal.propTypes = {
  modal: PropTypes.object,
  toggleModal: PropTypes.func,
};
