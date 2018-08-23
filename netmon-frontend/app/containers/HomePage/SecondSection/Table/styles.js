import styled from 'styled-components';

export const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
  min-height: 75vh;
  transform: rotateX(180deg);
  padding-top: 100vh;

  & ::-webkit-scrollbar {
    height: 10px;
    background-color: rgb(178, 216, 155, 1);
  }

  & ::-webkit-scrollbar:horizontal {
    position: top;
  }

  & ::-webkit-scrollbar-thumb {
    border: 1px solid rgb(255, 255, 255, 0.7);
    background: rgb(11, 126, 61, 1);
    border-radius: 5px;
  }

  & ::-webkit-scrollbar-thumb:hover {
    background: rgb(11, 126, 61, 0.7);
  }

  @media (max-width: 1280px) {
    max-width: 770px;
  }

  @media (max-width: 992px) {
    width: 100%;
  }
`;

export const TableTag = styled.table`
  transform: rotateX(180deg);
  min-width: 100%;
`;

export const Filler = styled.tr`
  height: 10px;
`;

// Checkbox
export const Checkbox = styled.input`
  display: none;
`;

export const StyledCheckbox = styled.span`
  display: block;
  position: relative;
  top: 1px;
  width: 17px;
  height: 17px;
  border: 2px solid #0b7e3d;
  cursor: pointer;
`;

export const StyledCheckboxActive = StyledCheckbox.extend`
  background-color: #0b7e3d;

  &:after {
    position: absolute;
    right: 1px;
    top: -5px;
    color: white;
    font-weight: 600;
    content: '✓';
  }
`;

export const NoDataDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 20px 0px;
  background-color: rgb(255, 255, 255, 0.7);
  transform: rotateX(180deg);
  font-size: 18px;
  font-weight: 500;
  color: #747474;
`;
