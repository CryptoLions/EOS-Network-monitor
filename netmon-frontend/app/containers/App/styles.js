import styled from 'styled-components';
import img from '../../assets/images/main_bg.jpg';
import segoeUI from '../../assets/fonts/segoeUI.ttf';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;

  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 100%), url(${img});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;

  font-family: 'Segoe UI';
  src: url(${segoeUI}) format('ttf');
  font-style: normal;
  font-weight: normal;
`;
