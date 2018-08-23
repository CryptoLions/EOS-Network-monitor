import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';

export const StyledCarousel = styled(Carousel)`
  & ul .dot {
    background-color: #0b7e3d !important;
  }
`;

export const CarouselWrapper = styled.div`
  min-height: 94vh;
  background: black;
  display: flex;
  align-items: center;
`;

export const StyledArrow = styled.img`
  position: absolute;
  top: 45%;
  width: 36px;
  cursor: pointer;
  margin: 10px;
  z-index: 1;
`;

export const StyledRightArrow = StyledArrow.extend`
  right: 0;
`;

export const CarouselItemWrapper = styled.div``;

export const CarouselItem = styled.img``;
