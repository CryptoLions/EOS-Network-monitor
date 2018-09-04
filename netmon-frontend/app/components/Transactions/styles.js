import styled from 'styled-components';

export const Container = styled.section`
  width: 100%;
  overflow-x: scroll;
  padding-bottom: 30px;
`;

export const Table = styled.table`
  min-width: 100%;
  background-color: rgba(255, 255, 255, 0.7);
`;

export const Link = styled.a`
  cursor: pointer;
  text-decoration: none;
  color: #007bff;
  padding: 2px 0 2px 5px;
  font-size: 12px;
`;

// Table
export const TableHead = styled.thead`
  border: 1px solid #fff;
  background-color: rgba(180, 213, 146, 0.7);
`;

export const TRow = styled.tr`
  border-bottom: 1px solid grey;
`;

export const TData = styled.td`
  width: 15%;
  word-wrap: normal;
  padding: 7px 5px;
  font-size: 16px;
`;

export const THData = TData.extend`
  font-weight: bold;
`;

export const NewLineSpan = styled.span`
  display: block;
`;
