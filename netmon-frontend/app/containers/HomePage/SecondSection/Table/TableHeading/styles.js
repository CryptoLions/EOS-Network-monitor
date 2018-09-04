import styled from 'styled-components';

// Table
export const TableHead = styled.thead`
  background-color: rgba(178, 216, 155, 1);
`;

export const Tdata = styled.td`
  font-size: 18px;
  font-weight: 500;
  height: 35px;
  color: #747474;
  text-align: center;
  white-space: nowrap;
`;

export const FixedCell = Tdata.extend`
  position: sticky !important;
  left: 0;
  top: 0;
  z-index: 1;
  padding-left: 45px;
  background-color: rgb(178, 216, 155);
`;

export const ColumnMenuTdata = styled.td`
  width: 20px;
  height: 35px;
`;
