// Core
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { I18nextProvider } from 'react-i18next';

// Eslint
/* eslint global-require: 0 */

// Google analytics
import ReactGA from 'react-ga';

// Components
import HomePage from 'containers/HomePage/Loadable';
import EasterEggPage from 'containers/EasterEggPage';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import socket from '../../init/socket';
import i18n from './i18n';

// Selectors
import { selectActualBackgroundNumber } from '../../bus/ui/selectors';

// Styles
import { Wrapper } from './styles';

ReactGA.initialize('UA‌-123095269-1');

const mapStateToProps = createStructuredSelector({
  actualBackgroundNumber: selectActualBackgroundNumber(),
});

@connect(mapStateToProps)
export default class App extends PureComponent {
  componentDidMount() {
    socket.connect();
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    const { actualBackgroundNumber } = this.props;

    return (
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
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
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/easteregg" component={EasterEggPage} />
                <Route component={NotFoundPage} />
              </Switch>
            </Wrapper>
          </ThemeProvider>
        </BrowserRouter>
      </I18nextProvider>
    );
  }
}

App.propTypes = {
  actualBackgroundNumber: PropTypes.number,
};
