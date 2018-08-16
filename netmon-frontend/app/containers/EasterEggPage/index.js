// Core
import React, { PureComponent, Fragment } from 'react';
// import PropTypes from 'prop-types';
import times from 'lodash/times';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Components
import Footer from '../../components/Footer';

// Selectors
import { selectActualBackgroundNumber } from '../../bus/ui/selectors';

// Styles
import { CarouselItem, StyledCarousel, StyledArrow } from './styles';

import arrowLeft from './svg/arrowLeft.svg';
import arrowRight from './svg/arrowRight.svg';

const mapStateToProps = createStructuredSelector({
  actualBackgroundNumber: selectActualBackgroundNumber(),
});

@connect(mapStateToProps)
export default class EasterEggPage extends PureComponent {
  render() {
    // const { actualBackgroundNumber } = this.props;
    return (
      <Fragment>
        <StyledCarousel
          slideIndex={14}
          transitionMode="fade"
          renderCenterLeftControls={({ previousSlide }) => <StyledArrow src={arrowLeft} onClick={previousSlide} />}
          renderCenterRightControls={({ nextSlide }) => <StyledArrow src={arrowRight} onClick={nextSlide} />}
        >
          {times(16, i => (
            <CarouselItem
              key={i}
              style={{
                backgroundImage: `url(${require(`./sliderImages/${i}.jpg`)})`, // eslint-disable-line global-require
              }}
            />
          ))}
        </StyledCarousel>
        <Footer path="/" />
      </Fragment>
    );
  }
}

// EasterEggPage.propTypes = {
//   actualBackgroundNumber: PropTypes.number,
// };
