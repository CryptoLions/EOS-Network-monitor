// Core
import React from 'react';
import PropTypes from 'prop-types';

// Styles
import { MenuIcon } from '../styles';

export const SvgMenuIcon = ({ handleToggleTableMenu }) => (
  <MenuIcon viewBox="0 0 512 512" onClick={handleToggleTableMenu}>
    <circle cx="256" cy="256" r="64" fill="#FFFFFF" />
    <circle cx="256" cy="448" r="64" fill="#FFFFFF" />
    <circle cx="256" cy="64" r="64" fill="#FFFFFF" />
  </MenuIcon>
);

SvgMenuIcon.propTypes = {
  handleToggleTableMenu: PropTypes.func,
};
