// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

// Styles
import { Header, HeadBox, HeadText } from '../styles';
import {
  LegendContainer,
  Heading,
  Content,
  BottomContent,
  AboutDiv,
  ColorsLegendDiv,
  ColorDiv,
  ColorDesc,
  TextSpan,
  ColorDescDash,
  Green,
  Red,
  Yellow,
  Purple,
  Grey,
  NoteDiv,
  Note,
  NoteNumber,
  Link,
  Bold,
  GreyText,
} from './styles';

@translate()
export default class Legend extends PureComponent {
  render() {
    const { t } = this.props;

    return (
      <Fragment>
        <Header>
          <HeadBox>
            <HeadText>{t('i18nModal.i18nLegend.title')}</HeadText>
          </HeadBox>
        </Header>
        <LegendContainer>
          <AboutDiv>
            <Heading>{t('i18nModal.i18nLegend.about')}</Heading>
            <Content>
              <span>{t('i18nModal.i18nLegend.content.0')}. </span>
              <span>{t('i18nModal.i18nLegend.content.1')}. </span>
              <span>{t('i18nModal.i18nLegend.content.2')}.</span>
            </Content>
            <BottomContent>
              <span>
                <Bold>{t('i18nModal.i18nLegend.tps.0')}</Bold> - {t('i18nModal.i18nLegend.tps.1')}
              </span>
              <span>
                <Bold>{t('i18nModal.i18nLegend.aps.0')}</Bold> - {t('i18nModal.i18nLegend.aps.1')}
              </span>
            </BottomContent>
          </AboutDiv>
          <ColorsLegendDiv>
            <Heading>{t('i18nModal.i18nLegend.colorsLegend')}</Heading>
            <ColorDiv>
              <Green /> - {t('i18nModal.i18nLegend.producingRightNow')}.
            </ColorDiv>
            <ColorDiv>
              <Red />
              <ColorDescDash>-</ColorDescDash>
              {t('i18nModal.i18nLegend.noResponse')}.
            </ColorDiv>
            <ColorDiv>
              <Yellow /> - {t('i18nModal.i18nLegend.otherVersion')}.
            </ColorDiv>
            <ColorDesc>{t('i18nModal.i18nLegend.versionInformation')}</ColorDesc>
            <ColorDiv>
              <Purple /> - {t('i18nModal.i18nLegend.unsynced')}.
            </ColorDiv>
            <ColorDesc>{t('i18nModal.i18nLegend.thisDoesNot')}</ColorDesc>
            <ColorDiv>
              <Grey /> - Error with bp.json.
            </ColorDiv>
            <ColorDesc>
              {t('i18nModal.i18nLegend.bps')}
              {', '}
              <Link href="https://github.com/eosrio/bp-info-standard">{t('i18nModal.i18nLegend.moreinfo')}</Link>
            </ColorDesc>
            <Heading>{t('i18nModal.i18nLegend.pingColorExplanation')}</Heading>
            <TextSpan>
              <GreyText>{t('i18nModal.i18nLegend.greyName')}</GreyText>
              {t('i18nModal.i18nLegend.greyPing')}
            </TextSpan>
            <div>{t('i18nModal.i18nLegend.blackPing')}</div>
          </ColorsLegendDiv>
          <NoteDiv>
            <Note>
              <NoteNumber>{t('i18nModal.i18nLegend.note1')}:</NoteNumber> {t('i18nModal.i18nLegend.ManyBp')}.
            </Note>
            <Note>
              <NoteNumber>{t('i18nModal.i18nLegend.note2')}:</NoteNumber> {t('i18nModal.i18nLegend.wePull')}.
            </Note>
          </NoteDiv>
        </LegendContainer>
      </Fragment>
    );
  }
}

Legend.propTypes = {
  t: PropTypes.func,
};
