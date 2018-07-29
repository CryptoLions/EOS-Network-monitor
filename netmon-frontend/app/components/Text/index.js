import styled from 'styled-components';
import { hover, display, space, color, fontSize, fontWeight, textAlign, lineHeight } from 'styled-system';

export const Text = styled.p`
  margin: 0;
  ${display}
  ${space}
  ${color}
  ${fontSize}
  ${lineHeight}
  ${fontWeight}
  ${textAlign}
  ${hover}
`;

export default Text;
