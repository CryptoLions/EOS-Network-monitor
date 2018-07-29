import styled, { keyframes } from 'styled-components';

export const SectionOne = styled.div`
  min-width: 370px;
  padding-top: 40px;
  margin-right: 30px;
  display: inherit;
  flex-direction: column;

  @media (max-width: 992px) {
    max-width: 370px;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
  }
`;

export const Wrapper = styled.section`
  display: inherit;
  flex-direction: column;
  background-color: rgb(255, 255, 255, 0.6);
  width: 100%;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

export const Header = styled.div`
  position: relative;
  width: 100%;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(178, 216, 155, 1);
`;

export const HeaderSpan = styled.span`
  display: block;
  font-size: 18px;
  font-weight: 500;
  color: #747474;
`;

export const Container = styled.div`
  padding: 0 15px 15px 15px;
  width: 100%;
`;

export const TextSpan = styled.span`
  display: block;
  font-size: 18px;
`;

export const GreenSpan = styled.span`
  color: rgb(0, 128, 0, 0.7);
  font-size: 20px;
  font-weight: bold;
`;

// Svg icons
const spinnerRotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const PlayIcon = styled.svg`
  position: absolute;
  right: 10px;
  top: 10px;
  width: 15px;
  height: 15px;
  cursor: pointer;

  & path {
    fill: #fff;
  }

  &:hover path {
    fill: #548afd;
  }
`;

export const SpinnerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px 0 10px 0;
`;

export const Spinner = styled.svg`
  width: 40px;
  height: 40px;
  animation: ${spinnerRotate} 1.5s infinite;

  & path {
    fill: rgb(178, 216, 155, 1);
  }
`;
