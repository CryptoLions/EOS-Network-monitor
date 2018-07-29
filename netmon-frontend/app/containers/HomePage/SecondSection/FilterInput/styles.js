import styled from 'styled-components';

export const FilterContainer = styled.div`
  max-width: 245px;
  width: 100%;
  height: 30px;
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 5px;
  border: none;
  background-color: #fff;
  box-shadow: 0px 2px 5px 0.3px rgba(0, 0, 0, 0.5);
`;

export const SearchIcon = styled.svg`
  position: absolute;
  top: 7px;
  right: 7px;
  width: 14px;
  height: 14px;
  cursor: text;
  pointer-events: none;
`;
