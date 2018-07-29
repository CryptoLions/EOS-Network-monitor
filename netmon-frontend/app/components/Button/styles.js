import styled from 'styled-components';
import { rem } from 'polished';
import colors from 'assets/styles/colors';
import { borderColor, color, minWidth, space } from 'styled-system';

const size = {
  small: `
    height: 39px;
    min-width: 110px;
    font-size: ${rem(16)};
    line-height: ${rem(21)};
  `,
  medium: `
    height: 42px;
    min-width: 145px;
    font-size: ${rem(18)};
    line-height: ${rem(24)};
  `,
  large: `
    height: 48px;
    min-width: 177px;
    font-size: ${rem(24)};
    line-height: ${rem(30)};
  `,
};

const primary = `
  background: ${colors.primaryOrange};
  color: ${colors.white};
  &:hover {
    background: ${colors.white};
	  border: 2px solid ${colors.primaryOrange};    
	  color: ${colors.primaryOrange};
  }  
`;

const secondary = `
  background: transparent;
  border: 2px solid ${colors.primaryOrange};    
  color: ${colors.primaryOrange};
  &:hover {
    background: ${colors.primaryOrange};
    color: ${colors.white};
    border: none;
  }  
`;

const mediumAdaptive = `
  @media (max-width: 767px) {
    ${size.small}
  }
`;

export const Button = styled.button`
  transition: all 150ms;

  &:hover {
    transition: all 150ms;
  }

  ${props => (props.secondary ? secondary : primary)};
  ${props => props.mediumAdaptive && mediumAdaptive};
  ${props => (props.size ? size[props.size] : size.medium)};
  ${borderColor}
  ${color}
  ${minWidth}
  ${space}
  
  ${props =>
    props.disabled &&
    `
    opacity: 0.5;
    pointer-events: none;
  `}
`;
