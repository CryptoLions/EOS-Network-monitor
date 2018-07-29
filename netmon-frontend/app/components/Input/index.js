import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Flex from 'components/Flex';

import { StyledInput, Label, ErrorMessage } from './styles';

class Input extends PureComponent {
  render() {
    const { children, hint, tooltipMessage, ...rest } = this.props;

    return (
      <Flex position="relative" alignItems="center" flexWrap="wrap" flex="1" w={1} {...rest.margin}>
        {children && (
          <Flex alignItems="center" mb={9} width="100%">
            <Label>{children}</Label>
          </Flex>
        )}
        <StyledInput {...rest} />
        {rest.error && <ErrorMessage>{rest.error}</ErrorMessage>}
      </Flex>
    );
  }
}

Input.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  hint: PropTypes.bool,
  tooltipMessage: PropTypes.string,
};

export default Input;
