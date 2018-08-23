import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: rgb(44, 168, 78, 1);
`;

export const Notification = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const ImgSvg = styled.img`
  margin: 0 10px;
  width: 30px;
`;

export const TextSpan = styled.span`
  color: #fff;
  font-size: 18px;
  text-align: center;
`;

export const TextSpanBold = TextSpan.extend`
  font-weight: bold;
`;

export const Cross = styled.div`
  font-size: 26px;
  padding: 0 10px 5px 0;
  cursor: pointer;
  color: #fff;

  &:after {
    content: '×';
  }

  &:hover {
    color: red;
  }
`;

export const StyledLink = styled.a`
  color: #fff;
`;
