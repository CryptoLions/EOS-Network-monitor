import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  width: 15px;
  height: 33px;
`;

export const Container = styled.div`
  position: absolute;
  padding: 8px;
  background-color: white;
  width: 150px;
  z-index: 1;
  top: 15px;
  right: 5px;
  box-shadow: 0px 2px 5px 0.3px rgba(0, 0, 0, 0.5);
`;

export const Cross = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
  padding: 0 8px;
  font-size: 28px;
  cursor: pointer;

  &:after {
    content: '×';
  }

  &:hover {
    color: red;
  }
`;

export const HeadText = styled.span`
  font-size: 14px;
  display: block;
  padding: 0 20px 5px 0;
`;

export const Item = styled.label`
  font-size: 16px;
  padding: 3px;
  display: flex;
`;

export const ColumnName = styled.span`
  padding-left: 5px;
  ${({ isChecked }) =>
    isChecked && {
      color: '#0b7e3d',
    }}};
`;

export const HintText = styled.div`
  font-size: 11px;
  margin-bottom: 10px;
`;

export const Bold = styled.span`
  font-weight: 800;
`;

export const ResetLink = styled.div`
  cursor: pointer;
  color: #007bff;
  text-align: right;
`;

// Svg
export const MenuIcon = styled.svg`
  width: 18px;
  height: 35px;
  cursor: pointer;

  & :hover path {
    fill: red;
  }
`;
