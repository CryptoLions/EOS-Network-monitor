// Core
import styled from 'styled-components';

// Fonts
import segoeUI from '../../assets/fonts/segoeUI.ttf';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;

  font-family: 'Segoe UI';
  src: url(${segoeUI}) format('ttf');
  font-style: normal;
  font-weight: normal;
`;
