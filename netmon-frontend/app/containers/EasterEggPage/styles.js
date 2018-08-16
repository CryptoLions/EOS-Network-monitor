import styled from 'styled-components';
import Carousel from 'nuka-carousel';

export const StyledCarousel = styled(Carousel)`
  height: 94vh !important;
  & * button {
    color: #0b7e3d !important;
    font-size: 34px !important;
  }
`;

export const StyledArrow = styled.img`
  width: 36px;
  cursor: pointer;
  margin: 10px;
`;

export const CarouselItem = styled.div`
  width: 100vw;
  height: 94vh;
  background-size: cover;
`;
