import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 6vh;
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

export const RegularLink = styled.a`
  color: white;
`;

export const LanguageSwitcher = styled.span`
  color: white;
  padding-left: 8px;
  padding-right: 8px;
  border-right: 1px solid white;
  cursor: pointer;
  &:active {
    color: blue;
  }
  &:last-child {
    border: 0;
  }
`;
