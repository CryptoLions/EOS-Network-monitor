import styled from 'styled-components';

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

export const OverflowContainer = styled.section`
  overflow: hidden;
  width: 100%;
  height: auto;
  max-height: 600px;
`;

export const HeadDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0;
`;

export const SmallText = styled.div`
  margin-top: 20px;
  font-size: 14px;
`;
