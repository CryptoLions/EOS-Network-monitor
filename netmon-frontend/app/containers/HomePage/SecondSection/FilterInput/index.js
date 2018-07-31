// Core
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Svg
import { IconSvg } from './svg';

// Styles
import { FilterContainer, Input } from './styles';

export default class FilterInput extends PureComponent {
  state = { isOnFocus: false };

  onChange = e => this.props.setFilterInputValue(e.target.value);

  clearFilterInput = () => this.props.setFilterInputValue('');

  isInputOnFocusToggle = () => this.setState(({ isOnFocus }) => ({ isOnFocus: !isOnFocus }));

  render() {
    const { isOnFocus } = this.state;
    const { filterInputValue } = this.props;

    return (
      <FilterContainer>
        <Input
          value={filterInputValue}
          onChange={this.onChange}
          onBlur={this.isInputOnFocusToggle}
          onFocus={this.isInputOnFocusToggle}
        />
        <IconSvg
          isOnFocus={isOnFocus}
          filterIsEmpty={!filterInputValue.length}
          clearFilterInput={this.clearFilterInput}
        />
      </FilterContainer>
    );
  }
}

FilterInput.propTypes = {
  filterInputValue: PropTypes.string,
  setFilterInputValue: PropTypes.func,
};
