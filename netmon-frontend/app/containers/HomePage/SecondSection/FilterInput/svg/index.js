// Core
import React from 'react';
import PropTypes from 'prop-types';

// Styles
import { SvgIcon, SvgCrossIcon } from '../styles';

export const IconSvg = ({ isOnFocus, filterIsEmpty, clearFilterInput }) =>
  filterIsEmpty ? (
    <SvgIcon viewBox="0 0 56.966 56.966">
      <path
        fill={isOnFocus ? '#548afd' : '#aaaaaa'}
        d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23
          	s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92
          	c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17
          	s-17-7.626-17-17S14.61,6,23.984,6z"
      />
    </SvgIcon>
  ) : (
    <SvgCrossIcon viewBox="0 0 357 357" onClick={clearFilterInput}>
      <polygon
        points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3
			214.2,178.5"
      />
    </SvgCrossIcon>
  );

IconSvg.propTypes = {
  isOnFocus: PropTypes.bool,
  filterIsEmpty: PropTypes.bool,
  clearFilterInput: PropTypes.func,
};
