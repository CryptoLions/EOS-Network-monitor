// Core
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Google analytics
import ReactGA from 'react-ga';

// Eslint
/* eslint global-require: 0 */

// Components
import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Notifications from '../../components/Notifications';
import socket from '../../init/socket';

// Selectors
import { selectActualBackgroundNumber } from '../../bus/ui/selectors';

// Styles
import { Wrapper } from './styles';

const mapStateToProps = createStructuredSelector({
  actualBackgroundNumber: selectActualBackgroundNumber(),
});

@connect(mapStateToProps)
export default class App extends PureComponent {
  componentDidMount() {
    socket.connect();
    ReactGA.initialize('UA‌-123095269-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    const { actualBackgroundNumber } = this.props;

    return (
      <ThemeProvider
        theme={{
          space: [0, 20, 20, 20, 30],
          breakpoints: ['320px', '768px', '1024px', '1200px'],
        }}
      >
        <Wrapper
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 100%), url(${require(`./bg_images/${actualBackgroundNumber}.jpg`)})`,
          }}
          bgNum={actualBackgroundNumber}
        >
          <Notifications />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Wrapper>
      </ThemeProvider>
    );
  }
}

App.propTypes = {
  actualBackgroundNumber: PropTypes.number,
};
