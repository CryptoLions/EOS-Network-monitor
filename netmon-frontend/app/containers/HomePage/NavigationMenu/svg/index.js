// Core
import React from 'react';
import PropTypes from 'prop-types';

// Styles
import { NavMenuButton } from '../styles';

export const SvgMenuButton = ({ toggleNavMenuHandler }) => (
  <NavMenuButton viewBox="0 0 459 459" onClick={toggleNavMenuHandler}>
    <path d="M0,382.5h459v-51H0V382.5z M0,255h459v-51H0V255z M0,76.5v51h459v-51H0z" />
  </NavMenuButton>
);

SvgMenuButton.propTypes = {
  toggleNavMenuHandler: PropTypes.func,
};
