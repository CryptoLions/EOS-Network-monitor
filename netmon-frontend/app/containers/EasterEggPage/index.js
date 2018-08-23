// Core
import React, { PureComponent, Fragment } from 'react';
// import PropTypes from 'prop-types';
import times from 'lodash/times';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// eslint-disable-next-line
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

// Components
import Footer from '../../components/Footer';
import arrowLeft from './svg/arrowLeft.svg';
import arrowRight from './svg/arrowRight.svg';

// Selectors
import { selectActualBackgroundNumber } from '../../bus/ui/selectors';

// Styles
import {
  CarouselItem,
  CarouselWrapper,
  StyledCarousel,
  CarouselItemWrapper,
  StyledArrow,
  StyledRightArrow,
} from './styles';

const mapStateToProps = createStructuredSelector({
  actualBackgroundNumber: selectActualBackgroundNumber(),
});

const numberOfSlides = 16;

@connect(mapStateToProps)
export default class EasterEggPage extends PureComponent {
  state = {
    currentSlide: 0,
  };

  toggleSlide = direction => () => {
    const { currentSlide } = this.state;
    if (direction === 'next' && currentSlide === numberOfSlides) {
      return;
    }

    if (direction === 'prev' && currentSlide === 0) {
      return;
    }

    const slideQualifier = direction === 'next' ? 1 : -1;
    this.setState(prevState => ({
      currentSlide: prevState.currentSlide + slideQualifier,
    }));
  };

  updateCurrentSlide = index => {
    const { currentSlide } = this.state;

    if (currentSlide !== index) {
      this.setState({
        currentSlide: index,
      });
    }
  };

  render() {
    return (
      <Fragment>
        <CarouselWrapper>
          <StyledArrow src={arrowLeft} onClick={this.toggleSlide('prev')} />
          <StyledRightArrow src={arrowRight} onClick={this.toggleSlide('next')} />
          <StyledCarousel
            emulateTouch
            showArrows={false}
            showThumbs={false}
            dynamicHeight
            showStatus={false}
            selectedItem={this.state.currentSlide}
            onChange={this.updateCurrentSlide}
          >
            {times(numberOfSlides, i => (
              <CarouselItemWrapper key={i}>
                <CarouselItem
                  key={i}
                  src={`${require(`./sliderImages/${i}.jpg`)}`} // eslint-disable-line global-require
                />
              </CarouselItemWrapper>
            ))}
          </StyledCarousel>
        </CarouselWrapper>
        <Footer path="/" />
      </Fragment>
    );
  }
}
