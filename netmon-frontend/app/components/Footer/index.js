import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { FooterWrapper, FooterSpan, RegularLink, Lion, LanguageSwitcher } from './styles';

// Image
import lion from '../../assets/images/lion.png';

@translate()
export default class Footer extends Component {
  changeLanguage = lng => () => this.props.i18n.changeLanguage(lng);

  render() {
    const { t, path } = this.props;

    return (
      <FooterWrapper>
        <FooterSpan>
          <Link to={path}>
            <Lion src={lion} alt="Lion" />
          </Link>
          2018 {t('footer.createdBy')}{' '}
          <RegularLink href="https://cryptolions.io" target="__blank">
            {t('footer.cryptoLions')}
          </RegularLink>{' '}
          (
          <RegularLink href="https://github.com/CryptoLions/EOS-Testnet-monitor" target="__blank">
            {t('footer.gitHub')}
          </RegularLink>{' '}
          v2.0.
          {process.env.VERSION_NUMBER})
        </FooterSpan>
        <div>
          <LanguageSwitcher onClick={this.changeLanguage('en-US')}>En</LanguageSwitcher>
          <LanguageSwitcher onClick={this.changeLanguage('ru-RU')}>Ru</LanguageSwitcher>
          <LanguageSwitcher onClick={this.changeLanguage('zh-CN')}>Cn</LanguageSwitcher>
        </div>
      </FooterWrapper>
    );
  }
}

Footer.propTypes = {
  t: PropTypes.func,
  i18n: PropTypes.func,
  path: PropTypes.string,
};
