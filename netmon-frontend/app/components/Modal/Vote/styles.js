import styled from 'styled-components';
import { Main } from '../styles';

export const MainContainer = Main.extend`
  justify-content: center;
  align-items: center;
  padding: 5px 10% 10% 10%;
`;

export const TextSpan = styled.span`
  text-align: center;
  font-size: 16px;
  padding-bottom: 20px;
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 30px;

  @media (max-width: 500px) {
    height: auto;
    flex-direction: column;
    align-items: center;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 30px;
  padding: 0px 10px;
  border: 1px solid black;
  border-right: none;

  @media (max-width: 500px) {
    border-right: 1px solid black;
    margin-bottom: 15px;
  }
`;

const InputButton = styled.a`
  height: 100%;
  font-size: 16px;
  padding: 3px 30px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
`;

export const InstallLink = InputButton.extend`
  color: #ffc107;
  background-color: #e9ecef;
  &:hover {
    color: #fff;
    background-color: #ffc107;
  }
`;

export const ScatterLink = InputButton.extend`
  border-color: #28a745;
  color: #fff;
  background-color: #28a745;
  &:hover {
    color: #28a745;
    background-color: #fff;
  }
`;

export const Footer = styled.div`
  margin-top: 15px;
  padding: 10px;
  width: 100%;
  background-color: #222222;
`;

export const FooterText = TextSpan.extend`
  font-size: 14px;
  color: #00ff01;
  padding: 0;
`;

export const Bold = styled.span`
  font-weight: bold;
`;

export const ScatterError = styled.div`
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
`;

export const ScatterSuccess = styled.div`
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
`;
