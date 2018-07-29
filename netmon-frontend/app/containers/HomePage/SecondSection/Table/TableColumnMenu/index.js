// Core
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
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

// Data
import columnNames from './columnNames';

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
export default class TableColumnMenu extends Component {
  state = {
    tableMenuState: false,
  };

  handleSelectTableColumns = e => this.props.actions.setTableColumnState(e.target.getAttribute('name'));

  handleToggleTableMenu = () => this.setState(({ tableMenuState }) => ({ tableMenuState: !tableMenuState }));

  resetColumnsVisibility = () => {
    this.props.actions.resetColumnsVisibility();
  };

  render() {
    const { tableMenuState } = this.state;

    return (
      <Wrapper>
        <SvgMenuIcon handleToggleTableMenu={this.handleToggleTableMenu} />
        <Fragment>
          {tableMenuState && (
            <Container>
              <Cross onClick={this.handleToggleTableMenu} />
              <HeadText>Columns</HeadText>
              <HintText>
                Hint: <Bold>Shift + scroll</Bold> to scroll table horizontally
              </HintText>
              {columnNames.map(({ columnName, renderName }) => (
                <Item key={columnName}>
                  <Checkbox
                    name={columnName}
                    type="checkbox"
                    checked={this.props.tableColumnState[columnName]}
                    onChange={this.handleSelectTableColumns}
                  />
                  {this.props.tableColumnState[columnName] ? <StyledCheckboxActive /> : <StyledCheckbox />}
                  <ColumnName name={columnName} isChecked={this.props.tableColumnState[columnName]}>
                    {renderName}
                  </ColumnName>
                </Item>
              ))}
              <ResetLink onClick={this.resetColumnsVisibility}>Reset</ResetLink>
            </Container>
          )}
        </Fragment>
      </Wrapper>
    );
  }
}

TableColumnMenu.propTypes = {
  tableColumnState: PropTypes.object,
  actions: PropTypes.object,
};
