import styled from 'styled-components';

export const LegendContainer = styled.div`
  width: 100%;
  background-color: rgb(255, 255, 255, 0.7);
  padding: 0 20px 20px 20px;
`;

// About div
export const AboutDiv = styled.div`
  padding-bottom: 20px;
`;

export const Heading = styled.span`
  display: block;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 10px;
  color: #28a745;
`;

export const Content = styled.div`
  align-items: center;
  text-align: center;
  flex-direction: column;
  padding: 0px 10%;
`;

export const BottomContent = styled.div`
  display: flex;
  padding-top: 20px;
  flex-direction: column;
`;

// Color legend Div
export const ColorsLegendDiv = styled.div``;

export const ColorDiv = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const ColorDesc = styled.span`
  display: block;
  padding: 10px 0;
`;

// Colors
export const Color = styled.span`
  display: block;
  width: 30px;
  height: 30px;
  margin-right: 5px;
`;

export const Green = Color.extend`
  background-color: rgb(17, 168, 39, 0.7);
`;

export const Red = Color.extend`
  background-color: rgb(255, 4, 4, 0.7);
`;

export const Yellow = Color.extend`
  background-color: rgb(255, 255, 155, 0.7);
`;

export const Purple = Color.extend`
  background-color: rgb(199, 165, 239, 0.7);
`;

export const Grey = Color.extend`
  background-color: rgb(170, 175, 183, 0.7);
`;

// Note div
export const NoteDiv = styled.div`
  padding-top: 10px;
`;

export const Note = styled.div`
  padding: 5px 0;
`;

export const NoteNumber = styled.span`
  font-weight: bold;
`;

export const Link = styled.a`
  text-decoration: none;
  color: #007bff;

  &:hover {
    text-decoration: underline;
    color: #005dc1;
  }
`;

export const Bold = styled.span`
  font-weight: bold;
`;
