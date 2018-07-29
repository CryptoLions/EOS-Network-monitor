import styled, { keyframes } from 'styled-components';

// Modal
const modalWrapperBgc = keyframes`
  from { opacity: 0.7; }
  to { opacity: 1; }
`;

const modalAppear = keyframes`
  from { bottom: 50px; opacity: 0; }
  to { bottom: 0; opacity: 1; }
`;

export const ModalWrapper = styled.div`
  position: fixed;
  align-items: center;
  justify-content: center;
  background-color: rgb(0, 0, 0, 0.5);
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  animation: ${modalWrapperBgc} 0.5s;
`;

export const ModalContainer = styled.section`
  position: relative;
  z-index: 2;
  max-width: 800px;
  width: auto;
  margin: 1.75rem auto;
  background-color: white;
  animation: ${modalAppear} 0.5s;
  @media (max-width: 500px) {
    border-radius: 0;
    margin: 0px;
  }
`;

// Exit
export const Cross = styled.div`
  position: absolute;
  right: 13px;
  top: 0px;
  font-size: 26px;
  cursor: pointer;
  color: #fff;

  &:after {
    content: '×';
  }

  &:hover {
    color: red;
  }
`;

// Input & Button
export const InputsDiv = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
`;

export const Input = styled.input`
  max-width: 200px;
  height: 45px;
  padding: 0px 10px;
  border: 1px solid rgb(0, 0, 0, 0.2);
  margin-left: -1px;
`;

export const Button = styled.button`
  outline: none;
  padding: 0px 14px;
  border-width: 1px;
  border-style: solid;
  border-radius: 6px;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  background-color: #fff;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
`;

export const GetButton = styled.button`
  width: 100px;
  height: 45px;
  color: #28a745;
  background-color: #fff;
  border: 1px solid #28a745;
  &:hover {
    color: #fff;
    background-color: #28a745;
  }
`;

// Link
export const Link = styled.a`
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
  word-break: break-word;

  &:hover {
    text-decoration: underline;
    color: #005dc1;
  }
`;

// <Main /> containers
export const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

// Header
export const Header = styled.header`
  width: 100%;
  padding-bottom: 20px;
`;

export const HeadBox = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #28a745;
`;

export const HeadText = styled.span`
  font-size: 22px;
  color: #fff;
  padding: 5px 0;
`;

export const HeadContainer = styled.div`
  padding: 20px 20px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

// Text
export const TextSpan = styled.span`
  font-size: 18px;
  word-break: break-word;
`;

export const TextSpanBold = TextSpan.extend`
  font-weight: bold;
  padding-right: 5px;
`;
