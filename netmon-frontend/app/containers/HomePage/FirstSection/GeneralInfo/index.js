// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

// Utils
import { formatNumber } from '../../../../utils/intUtils';

// Svg
import { SvgSpinner } from '../svg';

// Styles
import { Wrapper, Header, HeaderSpan, TextSpan, GreenSpan } from '../styles';
import { Container, GreenLink } from './styles';

@translate()
export default class GeneralInfo extends PureComponent {
  render() {
    const { t, tpsApsStats, connectedUsers, toggleModal } = this.props;

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
  connectedUsers: PropTypes.number,
  toggleModal: PropTypes.func,
};
