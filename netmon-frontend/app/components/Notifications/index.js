// Core
import React, { PureComponent } from 'react';
import store from 'store';

// Svg
import svg from './svg/alarm.svg';

// Styles
import { Container, Notification, ImgSvg, TextSpan, TextSpanBold, Cross } from './styles';

const NOTIFICATION_ID = 3;

export default class Notifications extends PureComponent {
  state = {
    closedNotificationId: store.get('closedNotificationId') || 0,
  };

  hideNotification = () => {
    this.setState({ closedNotificationId: NOTIFICATION_ID });
    store.set('closedNotificationId', NOTIFICATION_ID);
  };

  render() {
    const { closedNotificationId } = this.state;
    return (
      NOTIFICATION_ID > closedNotificationId && (
        <Container>
          <Notification>
            <ImgSvg src={svg} alt="nice" />
            <TextSpan>
              <TextSpanBold>NOTE:</TextSpanBold>
              EOS Network Monitor 2.0 is Syncing. Some data (like tps/aps all time high) will be updated as we sync with
              the chain.
            </TextSpan>
          </Notification>
          <Cross onClick={this.hideNotification} />
        </Container>
      )
    );
  }
}
