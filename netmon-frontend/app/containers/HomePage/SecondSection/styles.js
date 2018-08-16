import styled from 'styled-components';

export const SectionTwo = styled.section`
  width: 68vw;
  display: flex;
  flex-direction: column;

  @media (max-width: 1920px) {
    width: 58vw;
  }

  @media (max-width: 1280px) {
    width: 770px;
  }

  @media (max-width: 992px) {
    width: 100%;
  }
`;

export const Intumentary = styled.div`
  width: 100%;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 992px) {
    padding: 0 10px 20px 10px;
  }

  @media (max-width: 768px) {
    padding: 0 0 15px 0;
    flex-direction: column;
    justify-content: center;
  }
`;

export const ButtonVote = styled.button`
  background-color: #28a745;
  color: #fff;
  border-radius: 2px;
  width: 245px;
  height: 30px;
  outline: none;
  box-shadow: 0px 2px 5px 0.3px rgba(0, 0, 0, 0.5);
  &:hover {
    background-color: #218838;
  }

  &:active {
    position: relative;
    top: 1px;
  }
`;
