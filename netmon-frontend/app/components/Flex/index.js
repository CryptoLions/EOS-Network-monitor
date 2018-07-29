import {
  display,
  background,
  position,
  border,
  borderColor,
  borderRadius,
  height,
  minWidth,
  maxWidth,
  minHeight,
} from 'styled-system';
import { Flex as gridFlex } from 'grid-styled';

const Flex = gridFlex.extend`
  ${display}
  ${position}
  ${height}
  ${minWidth}
  ${maxWidth}
  ${minHeight}
  ${border}
  ${borderColor}
  ${borderRadius}
  ${background}
`;

export default Flex;
