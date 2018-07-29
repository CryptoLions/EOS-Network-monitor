import styled, { keyframes } from 'styled-components';
import color from 'assets/styles/colors';

const center = `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const skBouncedelay = keyframes`
    0%, 80%, 100% { transform: scale(0);}
    40% { transform: scale(1.0); }
`;

export const Wrapper = styled.div`
  margin: 0 auto;
  width: 70px;
  text-align: center;
  ${props => (props.center ? center : '')};
`;

const small = `
  width: 12px;
  height: 12px;
`;

const medium = `
  width: 18px;
  height: 18px;
`;

const light = `
  background: ${color.alertSalem}
`;

const dark = `
  background: ${color.secondaryBlack}
`;

export const Bounce = styled.div`
  ${props => (props.size === 'small' ? small : medium)};
  ${props => (props.theme === 'light' ? light : dark)};
  border-radius: 100%;
  display: inline-block;
  animation: ${skBouncedelay} 1.4s infinite ease-in-out both;
`;

export const Bounce1 = Bounce.extend`
  animation-delay: -0.32s;
`;

export const Bounce2 = Bounce.extend`
  animation-delay: -0.16s;
`;
