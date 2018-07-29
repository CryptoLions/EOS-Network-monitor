import styled from 'styled-components';

export const MainContainer = styled.div`
  overflow-x: scroll;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  max-width: 1170px;

  @media (max-width: 992px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
`;

export const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #000;
  padding: 12px 0;

  @media (max-width: 768px) {
    padding: 5px 0;
  }
`;

export const Lion = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

export const FooterSpan = styled.span`
  text-align: center;
  color: #fff;
`;

export const Link = styled.a`
  color: white;
`;
