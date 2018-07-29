import React from 'react';
import PropTypes from 'prop-types';

import { LoadingLineContainer, Line } from './styles';

const LoadingLine = ({ state }) => (
  <LoadingLineContainer>
    <Line state={state} />
  </LoadingLineContainer>
);

LoadingLine.propTypes = {
  state: PropTypes.bool,
};

export default LoadingLine;
