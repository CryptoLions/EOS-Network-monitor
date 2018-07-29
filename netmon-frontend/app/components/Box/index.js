import { height, position, background, border, borderRadius, borderColor, minWidth, maxWidth } from 'styled-system';
import { Box as gridBox } from 'grid-styled';

const Box = gridBox.extend`
  ${position}
  ${height}
  ${minWidth}
  ${maxWidth}
  ${border}
  ${borderColor}
  ${borderRadius}
  ${background}
`;

export default Box;
