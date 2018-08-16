// Core
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

// Svg
import { SvgMenuButton } from './svg';

// Styles
import { Container, Header, Headlink, BlurBG, NavMenu, Border, BlueLink } from './styles';

@translate()
export default class NavigationMenu extends PureComponent {
  state = {
    isNavMenuActive: false,
  };

  componentDidUpdate() {
    if (this.state.isNavMenuActive) {
      window.addEventListener('resize', this.onResizeWindow);
    } else {
      window.removeEventListener('resize', this.onResizeWindow);
    }
  }

  onResizeWindow = () => window.innerWidth > 768 && this.toggleNavMenuHandler();

  toggleNavMenuHandler = () => this.setState(({ isNavMenuActive }) => ({ isNavMenuActive: !isNavMenuActive }));

  toggleModalHandler = (modalName, data) => () => {
    if (this.state.isNavMenuActive) this.toggleNavMenuHandler();
    this.props.toggleModal(modalName, data);
  };

  render() {
    const { isNavMenuActive } = this.state;
    const { t } = this.props;
    return (
      <Container>
        <Header>
          <SvgMenuButton toggleNavMenuHandler={this.toggleNavMenuHandler} />
          <Headlink href="http://eosnetworkmonitor.io/">{t('i18nNavigationMenu.headLink')}</Headlink>
        </Header>
        {isNavMenuActive && <BlurBG onClick={this.toggleNavMenuHandler} />}
        <NavMenu isNavMenuActive={isNavMenuActive}>
          <BlueLink onClick={this.toggleModalHandler('accountInfo', null)}>
            {t('i18nNavigationMenu.accountInfo')}
          </BlueLink>
          <Border />
          <BlueLink onClick={this.toggleModalHandler('accountHistory', null)}>
            {t('i18nNavigationMenu.accountHistory')}
          </BlueLink>
          <Border />
          <BlueLink onClick={this.toggleModalHandler('transactions', null)}>{t('i18nNavigationMenu.txInfo')}</BlueLink>
          <Border />
          <BlueLink onClick={this.toggleModalHandler('blockInfo', 1)}>{t('i18nNavigationMenu.api')}</BlueLink>
          <Border />
          <BlueLink href="https://eosnodes.privex.io/?config=1" target="__blank">
            {t('i18nNavigationMenu.p2p')}
          </BlueLink>
          <Border />
          <BlueLink href="http://jungle.cryptolions.io" target="__blank">
            {t('i18nNavigationMenu.testnet')}
          </BlueLink>
          <Border />
          <BlueLink href="https://github.com/CryptoLions/EOS-MainNet" target="__blank">
            {t('i18nNavigationMenu.nodeInstallation')}
          </BlueLink>
          <Border />
          <BlueLink onClick={this.toggleModalHandler('legend', null)}>{t('i18nNavigationMenu.legend')}</BlueLink>
        </NavMenu>
      </Container>
    );
  }
}

NavigationMenu.propTypes = {
  t: PropTypes.func,
  toggleModal: PropTypes.func,
};
