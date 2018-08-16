import styled from 'styled-components';

export const MainContainer = styled.div`
  overflow-x: auto;
  display: flex;
  justify-content: center;
  height: 100%;
  width: 90vw;

  @media (max-width: 1280px) {
    width: 100%;
    max-width: 1170px;
    justify-content: space-between;
  }

  @media (max-width: 992px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
`;
