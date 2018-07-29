// Core
import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

// Components
import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Notifications from '../../components/Notifications';
import socket from '../../init/socket';

// Styles
import { Wrapper } from './styles';

export default class App extends PureComponent {
  componentDidMount() {
    socket.connect();
  }

  render() {
    return (
      <ThemeProvider
        theme={{
          space: [0, 20, 20, 20, 30],
          breakpoints: ['320px', '768px', '1024px', '1200px'],
        }}
      >
        <Wrapper>
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
