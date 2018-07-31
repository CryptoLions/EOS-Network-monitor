// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

// Utils
import { formatNumber } from '../../../../utils/intUtils';
import { convertUtcToLocal } from '../../../../utils/dateUtils';

// Svg
import { SvgSpinner } from '../svg';

// Styles
import { RedSpan, HeadGreenSpan, FooterContainer, TimeGreenSpan } from './styles';
import { Wrapper, Header, HeaderSpan, Container, TextSpan, GreenSpan } from '../styles';

export default class CurrentBlockInfo extends PureComponent {
  render() {
    const { lastBlockStats } = this.props;

    return (
      <Wrapper>
        <Header>
          <HeaderSpan>Current block info</HeaderSpan>
        </Header>
        <Container>
          {lastBlockStats.head_block_num ? (
            <Fragment>
              <HeadGreenSpan>{formatNumber(lastBlockStats.head_block_num)}</HeadGreenSpan>
              <TimeGreenSpan>
                {lastBlockStats.head_block_time && convertUtcToLocal(lastBlockStats.head_block_time)}
              </TimeGreenSpan>
              <TextSpan>
                Irreversible Block: <GreenSpan>{formatNumber(lastBlockStats.last_irreversible_block_num)}</GreenSpan>
              </TextSpan>

              <FooterContainer>
                <TextSpan>
                  Produced by: <GreenSpan>{lastBlockStats.head_block_producer}</GreenSpan>
                </TextSpan>
                <div>
                  Next: <RedSpan>{lastBlockStats.next_producer}</RedSpan>
                </div>
              </FooterContainer>
            </Fragment>
          ) : (
            <SvgSpinner />
          )}
        </Container>
      </Wrapper>
    );
  }
}

CurrentBlockInfo.propTypes = {
  lastBlockStats: PropTypes.object,
};
