// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

// Utils
import { formatNumber } from '../../../../utils/intUtils';
import { convertUtcToLocal } from '../../../../utils/dateUtils';

// Svg
import { SvgSpinner } from '../svg';

// Styles
import { RedSpan, HeadGreenSpan, FooterContainer, TimeGreenSpan, DifferenceSpan } from './styles';
import { Wrapper, Header, HeaderSpan, Container, TextSpan, GreenSpan } from '../styles';

@translate()
export default class CurrentBlockInfo extends PureComponent {
  render() {
    const { t, lastBlockStats } = this.props;

    return (
      <Wrapper>
        <Header>
          <HeaderSpan>{t('i18nFirstSection.i18nCurrentBlockInfo.title')}</HeaderSpan>
        </Header>
        <Container>
          {lastBlockStats.head_block_num ? (
            <Fragment>
              <HeadGreenSpan>{formatNumber(lastBlockStats.head_block_num)}</HeadGreenSpan>
              <TimeGreenSpan>
                {lastBlockStats.head_block_time && convertUtcToLocal(lastBlockStats.head_block_time)}
              </TimeGreenSpan>
              <TextSpan>
                {t('i18nFirstSection.i18nCurrentBlockInfo.irreversibleBlock')}:{' '}
                <GreenSpan>{formatNumber(lastBlockStats.last_irreversible_block_num)}</GreenSpan>
                <DifferenceSpan>
                  {' '}
                  [{formatNumber(lastBlockStats.last_irreversible_block_num - lastBlockStats.head_block_num)}]
                </DifferenceSpan>
              </TextSpan>

              <FooterContainer>
                <TextSpan>
                  {t('i18nFirstSection.i18nCurrentBlockInfo.producedBy')}:{' '}
                  <GreenSpan>{lastBlockStats.head_block_producer}</GreenSpan>
                </TextSpan>
                <div>
                  {t('i18nFirstSection.i18nCurrentBlockInfo.next')}: <RedSpan>{lastBlockStats.next_producer}</RedSpan>
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
  t: PropTypes.func,
  lastBlockStats: PropTypes.object,
};
