import styled from 'styled-components';

export const TextLink = styled.a`
  display: inline-block;
  padding-right: 5px;
  text-decoration: none;
  color: #000;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
