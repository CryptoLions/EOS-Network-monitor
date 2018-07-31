import styled from 'styled-components';
import { Input, HeadContainer } from '../styles';

export const ApiInput = Input.extend`
  width: 50%;
  max-width: none;

  @media (max-width: 500px) {
    width: 100%;
    margin-bottom: 5px;
  }
`;

export const PreWrapper = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export const HeadContainerBI = HeadContainer.extend`
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: center;
  }
`;
