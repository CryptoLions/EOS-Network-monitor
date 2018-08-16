import styled from 'styled-components';
import { GreenSpan } from '../styles';

export const HeadGreenSpan = GreenSpan.extend`
  font-size: 60px;
  font-weight: normal;
`;

export const TimeGreenSpan = GreenSpan.extend`
  display: block;
  padding: 5px 0;
`;

export const RedSpan = GreenSpan.extend`
  color: rgb(174, 88, 198);
`;

export const FooterContainer = styled.div`
  width: 100%;
`;

export const DifferenceSpan = styled.span`
  position: relative;
  bottom: 7px;
  font-size: 14px;
  color: #84878b;
`;
