import styled, { keyframes } from 'styled-components';

const transformWidth = keyframes`
  from {
    width: 1%;
  }
  to {
    width: 100%;
  }
`;

export const LoadingLineContainer = styled.div`
  width: 100%;
  padding: 0 10px;
  height: 1px;
`;

export const Line = LoadingLineContainer.extend`
  height: 1px;
  background-color: black;
  ${({ state }) =>
    state
      ? {
          animation: `${transformWidth} 1.5s infinite ease-in-out both`,
        }
      : {
          width: '100%',
        }}};
`;

// animation: ${transformWidth} 1.5s infinite ease-in-out both;
