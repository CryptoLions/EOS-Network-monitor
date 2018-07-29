import styled from 'styled-components';
import { rem } from 'polished';
import color from 'assets/styles/colors';

export const StyledInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  font-size: ${rem(18)};
  line-height: ${rem(24)};
  color: ${color.secondaryNevada};
  background: ${color.white};
  border: 1px solid ${color.nobel};
  outline: none;
  cursor: pointer;
  &:focus {
    cursor: auto;
    border-color: ${color.primaryBlue};
  }

  ${({ error }) =>
    error &&
    `
    border-color: ${color.alertRed};
    
    &:focus {
      border-color: ${color.alertRed};
    }
  `};
`;

export const Label = styled.label`
  font-size: ${rem(16)};
  line-height: ${rem(21)};
`;

export const ErrorMessage = styled.p`
  margin: 0;
  font-size: ${rem(14)};
  line-height: ${rem(21)};
  color: ${color.alertRed};
`;
