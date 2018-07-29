import styled from 'styled-components';
import { Button } from '../styles';

export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PaginationButton = Button.extend`
  color: #007bff;
  border: 1px solid #dee2e6;
  height: 38px;
  margin: 10px;
  ${({ disabled }) => (disabled ? 'opacity: 0.3' : undefined)};
  &:hover {
    color: #0056b3;
    background-color: #e9ecef;
    border-color: #dee2e6;
  }
`;

export const GreenItemContainer = styled.div`
  color: green;
`;

export const TransactionBlock = styled.div`
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 10px;
  margin-bottom: 10px;

  &:last-child {
    border-bottom: 0;
    margin-bottom: 0;
  }
`;
