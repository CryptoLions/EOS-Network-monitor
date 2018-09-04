// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

// Utils
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { formatNumber } from '../../../../utils/intUtils';

// Svg
import { SvgSpinner } from '../svg';

// Styles
import { Wrapper, Header, HeaderSpan, TextSpan, GreenSpan } from '../styles';
import { Container, GreenLink } from './styles';
import {
  selectAdditionalInfoStats,
  selectConnectedUsers,
  selectTpsApsStats,
} from '../../../../bus/generalStats/selectors';

const mapStateToProps = createStructuredSelector({
  additionalInfoStats: selectAdditionalInfoStats(),
  tpsApsStats: selectTpsApsStats(),
  connectedUsers: selectConnectedUsers(),
});

@translate()
@connect(mapStateToProps)
export default class GeneralInfo extends PureComponent {
  correctBalance = balance => {
    if (!balance) {
      return '';
    }
    const [value] = balance.split(' ');
    return `${formatNumber(value.substr(0, value.length - 2))} EOS`;
  };

  render() {
    const { t, tpsApsStats, additionalInfoStats, connectedUsers, toggleModal } = this.props;

    return (
      <Wrapper>
        <Header>
          <HeaderSpan>{t('i18nFirstSection.i18nGeneralInfo.title')}</HeaderSpan>
        </Header>
        <Container>
          {tpsApsStats.stackedTotal ? (
            <Fragment>
              <TextSpan>
                {t('i18nFirstSection.i18nGeneralInfo.stakedTotal')}:{' '}
                <GreenSpan>{tpsApsStats.stackedTotal && formatNumber(tpsApsStats.stackedTotal)} EOS</GreenSpan>
              </TextSpan>
              <TextSpan>
                {t('i18nFirstSection.i18nGeneralInfo.tps')}:{' '}
                <GreenSpan>
                  {tpsApsStats.liveTps} /{' '}
                  <GreenLink onClick={() => toggleModal('blockInfo', tpsApsStats.maxTpsBlock)}>
                    {tpsApsStats.maxTps}
                  </GreenLink>
                </GreenSpan>
              </TextSpan>
              <TextSpan>
                {t('i18nFirstSection.i18nGeneralInfo.aps')}:{' '}
                <GreenSpan>
                  {tpsApsStats.liveAps} /{' '}
                  <GreenLink onClick={() => toggleModal('blockInfo', tpsApsStats.maxApsBlock)}>
                    {tpsApsStats.maxAps}
                  </GreenLink>
                </GreenSpan>
              </TextSpan>
              <TextSpan>
                {t('i18nFirstSection.i18nGeneralInfo.maxRamSize')}:{' '}
                <GreenSpan>{formatNumber(additionalInfoStats.maxRamSize)}</GreenSpan>
              </TextSpan>
              <TextSpan>
                {t('i18nFirstSection.i18nGeneralInfo.totalUnpaidBlocks')}:{' '}
                <GreenSpan>{formatNumber(additionalInfoStats.totalUnpaidBlocks)}</GreenSpan>
              </TextSpan>
              <TextSpan>
                {t('i18nFirstSection.i18nGeneralInfo.coreLiquidBalance')}:{' '}
                <GreenSpan>{this.correctBalance(additionalInfoStats.coreLiquidBalance)}</GreenSpan>
              </TextSpan>
              <TextSpan>
                {t('i18nFirstSection.i18nGeneralInfo.savingTotalBalance')}:{' '}
                <GreenSpan>{this.correctBalance(additionalInfoStats.savingTotalBalance)}</GreenSpan>
              </TextSpan>
              <TextSpan>
                {t('i18nFirstSection.i18nGeneralInfo.connectedUsers')}: <GreenSpan>{connectedUsers}</GreenSpan>
              </TextSpan>
            </Fragment>
          ) : (
            <SvgSpinner />
          )}
        </Container>
      </Wrapper>
    );
  }
}

GeneralInfo.propTypes = {
  t: PropTypes.func,
  tpsApsStats: PropTypes.object,
  additionalInfoStats: PropTypes.object,
  connectedUsers: PropTypes.number,
  toggleModal: PropTypes.func,
};
