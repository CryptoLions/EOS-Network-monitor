import styled from 'styled-components';
import segoeUISemiBold from '../../../assets/fonts/segoeUISemiBold.ttf';

const link = styled.a`
  text-decoration: none;
`;

export const Container = styled.div`
  display: inherit;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px 0;

  @media (max-width: 768px) {
    padding: 5px 0;
  }
`;

export const Headlink = link.extend`
  padding-bottom: 10px;
  font-family: 'Segoe UI';
  src: url(${segoeUISemiBold}) format('ttf');
  color: #028012;
  font-size: 50px;
  line-height: 50px;
  font-weight: 500;

  text-align: center;
  &:hover {
    color: #015a0c;
  }

  @media (max-width: 768px) {
    font-size: 22px;
    line-height: normal;
    padding: 0;
  }
`;

export const NavMenu = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 20px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

export const BlueLink = link.extend`
  cursor: pointer;
  color: #007bff;

  &:hover {
    text-decoration: underline;
    color: #005dc1;
  }
`;

export const Border = styled.span`
  padding: 0 15px;
  color: #007bff;
  &::after {
    content: '|';
  }

  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;
