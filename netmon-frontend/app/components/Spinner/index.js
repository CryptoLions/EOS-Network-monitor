import React from 'react';
import PropTypes from 'prop-types';
import { Wrapper, Bounce, Bounce1, Bounce2 } from './styles';

const Spinner = ({ theme, size, ...rest }) => (
  <Wrapper {...rest}>
    <Bounce1 theme={theme} size={size} />
    <Bounce2 theme={theme} size={size} />
    <Bounce theme={theme} size={size} />
  </Wrapper>
);

Spinner.propTypes = {
  theme: PropTypes.string,
  size: PropTypes.string,
};

export default Spinner;
