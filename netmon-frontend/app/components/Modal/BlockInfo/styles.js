import styled from 'styled-components';
import { Input, HeadContainer } from '../styles';

export const ApiInput = Input.extend`
  width: 50%;
  max-width: none;
`;

export const PreWrapper = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export const HeadContainerBI = HeadContainer.extend`
  flex-direction: row;
  justify-content: space-between;
`;
