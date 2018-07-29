import styled from 'styled-components';

export const RowData = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3px 0 3px 10px;
  background-color: ${({ iteration }) => (iteration % 2 ? '' : 'lightgrey')};
`;

export const Link = styled.a`
  cursor: pointer;
  text-decoration: none;
  color: #007bff;
  font-size: 18px;

  &:hover {
    text-decoration: underline;
  }
`;

export const ItemContainer = styled.div`
  display: block;
`;

export const TextSpan = styled.span`
  font-size: 12px;
  padding-right: 5px;
`;
