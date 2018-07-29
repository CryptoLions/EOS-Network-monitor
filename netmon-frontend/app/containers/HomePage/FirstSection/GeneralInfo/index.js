// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

// Utils
import { formatNumber } from '../../../../utils/intUtils';

// Svg
import { SvgSpinner } from '../svg';

// Styles
import { Wrapper, Header, HeaderSpan, TextSpan, GreenSpan } from '../styles';
import { Container, GreenLink } from './styles';

export default class GeneralInfo extends PureComponent {
  render() {
    const { tpsApsStats, connectedUsers, toggleModal } = this.props;

    return (
      <Wrapper>
        <Header>
          <HeaderSpan>General info</HeaderSpan>
        </Header>
        <Container>
          {tpsApsStats.stackedTotal ? (
            <Fragment>
              <TextSpan>
                Staked total:{' '}
                <GreenSpan>{tpsApsStats.stackedTotal && formatNumber(tpsApsStats.stackedTotal)} EOS</GreenSpan>
              </TextSpan>
              <TextSpan>
                TPS Live/All time high:{' '}
                <GreenSpan>
                  {tpsApsStats.liveTps} /{' '}
                  <GreenLink onClick={() => toggleModal('blockInfo', tpsApsStats.maxTpsBlock)}>
                    {tpsApsStats.maxTps}
                  </GreenLink>
                </GreenSpan>
              </TextSpan>
              <TextSpan>
                APS Live/All time high:{' '}
                <GreenSpan>
                  {tpsApsStats.liveAps} / {tpsApsStats.maxAps}
                </GreenSpan>
              </TextSpan>
              <TextSpan>
                Connected Users: <GreenSpan>{connectedUsers}</GreenSpan>
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
  tpsApsStats: PropTypes.object,
  connectedUsers: PropTypes.number,
  toggleModal: PropTypes.func,
};
