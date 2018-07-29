// Core
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Styles
import { Container, Headlink, NavMenu, Border, BlueLink } from './styles';

export default class NavigationMenu extends PureComponent {
  toggleModalHandler = (modalName, data) => () => this.props.toggleModal(modalName, data);

  render() {
    return (
      <Container>
        <Headlink href="http://eosnetworkmonitor.io/">EOS Network Monitor.io</Headlink>
        <NavMenu>
          <BlueLink onClick={this.toggleModalHandler('accountInfo', null)}>Account Info</BlueLink>
          <Border />
          <BlueLink onClick={this.toggleModalHandler('accountHistory', null)}>Account History</BlueLink>
          <Border />
          <BlueLink onClick={this.toggleModalHandler('transactions', null)}>TX Info</BlueLink>
          <Border />
          <BlueLink onClick={this.toggleModalHandler('blockInfo', 1)}>API</BlueLink>
          <Border />
          <BlueLink href="https://eosnodes.privex.io/?config=1" target="__blank">
            P2P
          </BlueLink>
          <Border />
          <BlueLink href="http://jungle.cryptolions.io" target="__blank">
            Testnet
          </BlueLink>
          <Border />
          <BlueLink href="https://github.com/CryptoLions/EOS-MainNet" target="__blank">
            Node Installation
          </BlueLink>
          <Border />
          <BlueLink onClick={this.toggleModalHandler('legend', null)}>Legend</BlueLink>
        </NavMenu>
      </Container>
    );
  }
}

NavigationMenu.propTypes = {
  toggleModal: PropTypes.func,
};
