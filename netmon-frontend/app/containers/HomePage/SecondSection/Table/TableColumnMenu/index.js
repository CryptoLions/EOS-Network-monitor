// Core
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { translate } from 'react-i18next';
import store from 'store';
/* eslint jsx-a11y/label-has-for:0 */

// Selectors
import { selectTableColumnState } from '../../../../../bus/ui/selectors';

// Actions
import { uiActions } from '../../../../../bus/ui/actions';

// Svg
import { SvgMenuIcon } from './svg';

// Styles
import { Wrapper, Container, Cross, HeadText, Item, ColumnName, HintText, Bold, ResetLink } from './styles';
import { Checkbox, StyledCheckbox, StyledCheckboxActive } from '../styles';

const mapStateToProps = createStructuredSelector({
  tableColumnState: selectTableColumnState(),
});

const mapDispatchToProps = dispach => ({
  actions: bindActionCreators(
    {
      setTableColumnState: uiActions.setTableColumnState,
      resetColumnsVisibility: uiActions.resetColumnsVisibility,
    },
    dispach
  ),
});

@connect(
  mapStateToProps,
  mapDispatchToProps
)
@translate()
export default class TableColumnMenu extends Component {
  state = {
    tableMenuState: false,
  };

  componentDidUpdate() {
    if (this.state.tableMenuState) {
      document.addEventListener('click', this.handleToggleTableMenu);
    } else {
      document.removeEventListener('click', this.handleToggleTableMenu);
    }
  }

  stopPropagation = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  handleSelectTableColumns = e => this.props.actions.setTableColumnState(e.target.getAttribute('name'));

  handleToggleTableMenu = () => this.setState(({ tableMenuState }) => ({ tableMenuState: !tableMenuState }));

  resetColumnsVisibility = () => this.props.actions.resetColumnsVisibility();

  render() {
    const { tableMenuState } = this.state;
    const {
      t,
      i18n: {
        options: { resources },
      },
    } = this.props;

    return (
      <Wrapper onClick={this.stopPropagation}>
        <SvgMenuIcon handleToggleTableMenu={this.handleToggleTableMenu} />
        <Fragment>
          {tableMenuState && (
            <Container>
              <Cross onClick={this.handleToggleTableMenu} />
              <HeadText>{t('i18nSecondSection.i18nTableColumnMenu.title')}</HeadText>
              <HintText>
                {t('i18nSecondSection.i18nTableColumnMenu.hintText.0')}:{' '}
                <Bold>{t('i18nSecondSection.i18nTableColumnMenu.hintText.1')}</Bold>{' '}
                {t('i18nSecondSection.i18nTableColumnMenu.hintText.2')}
              </HintText>
              {Object.entries(
                resources[store.get('eosMonitor_currentLanguage') || 'en'].translations.i18nSecondSection
                  .i18nTableColumnNames
              ).map(columnName => (
                <Item key={columnName[0]}>
                  <Checkbox
                    name={columnName[0]}
                    type="checkbox"
                    checked={this.props.tableColumnState[columnName[0]]}
                    onChange={this.handleSelectTableColumns}
                  />
                  {this.props.tableColumnState[columnName[0]] ? <StyledCheckboxActive /> : <StyledCheckbox />}
                  <ColumnName name={columnName[0]} isChecked={this.props.tableColumnState[columnName[0]]}>
                    {columnName[1]}
                  </ColumnName>
                </Item>
              ))}
              <ResetLink onClick={this.resetColumnsVisibility}>
                {t('i18nSecondSection.i18nTableColumnMenu.reset')}
              </ResetLink>
            </Container>
          )}
        </Fragment>
      </Wrapper>
    );
  }
}

TableColumnMenu.propTypes = {
  t: PropTypes.func,
  i18n: PropTypes.object,
  tableColumnState: PropTypes.object,
  actions: PropTypes.object,
};
