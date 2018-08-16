import styled from 'styled-components';

export const Trow = styled.tr`
  padding: 0px 5px;
  border-bottom: 1px solid #dee2e6;
  background-color: rgb(255, 255, 255, 0.7);
`;

// Details
export const DetailsDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 7px 0;
  font-size: 12px;
  color: #3b3e43;
`;

export const DetailsList = styled.ul`
  width: 22%;
  min-width: 170px;
  list-style: none;
  padding: 0;
`;

export const DetailsListItem = styled.li`
  padding: 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MapWrapper = styled.div`
  width: 170px;
`;

export const Map = styled.img`
  width: 170px;
  height: 104px;
`;

// Ping
export const PingSpan = styled.span`
  font-size: 14px;
  color: ${({ isPingUptated }) => (isPingUptated ? '#000' : '#84878b')};
`;

export const PingSpanBold = PingSpan.extend`
  font-size: 12px;
  color: #000;
  font-weight: bold;
  margin-left: 5px;
`;

// Others
export const TextSpan = styled.span`
  position: relative;
  bottom: 6px;
  font-size: 14px;
  color: #84878b;
`;

export const DetailsTextSpan = TextSpan.extend`
  position: relative;
  bottom: 6px;
  font-size: 8px;
  color: #3b3e43;
`;

export const TextLink = styled.a`
  display: inline-block;
  padding-right: 5px;
  text-decoration: none;
  color: #000;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const SvgExternalLink = styled.svg`
  cursor: pointer;
  width: 12px;
  height: 12px;

  & path {
    fill: #757575;
  }

  &:hover path {
    fill: #548afd;
  }
`;

export const Bold = styled.span`
  font-weight: bold;
  margin-left: 5px;
`;
