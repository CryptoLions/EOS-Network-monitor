import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { StyledSpan } from './styles';

class TimeAgo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ts: Date.now(),
    };
  }

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      this.setupTimeout();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    if (!value && nextProps.value) {
      clearTimeout(this.timeout);
      this.setupTimeout();
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  setupTimeout = () => {
    this.timeout = setTimeout(() => {
      this.setState({
        ts: Date.now(),
      });
      this.setupTimeout();
    }, 2000);
  };

  getHumanTimeAgo = () => {
    const { ts } = this.state;
    const { value, type } = this.props;

    if (!value) {
      return '--';
    }

    const diff = ts - value;
    if (diff < 0) {
      return '0sec';
    }
    if (diff < 60000) {
      return (
        <StyledSpan color={diff >= 15000 && type === 'answered' ? '#f2d24b' : undefined}>{`${Math.floor(
          diff / 1000
        )}sec`}</StyledSpan>
      );
    }
    const duration = moment.duration(ts - value);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    if (!hours && !minutes && !seconds) {
      return '0sec';
    }
    return (
      <StyledSpan color={type === 'answered' ? '#ff5456' : undefined}>{`${hours ? `${hours}h ` : ''}${
        minutes ? `${minutes}m ` : ''
      }${seconds ? `${seconds}sec ` : ''}`}</StyledSpan>
    );
  };

  render() {
    return this.getHumanTimeAgo();
  }
}

TimeAgo.propTypes = {
  value: PropTypes.number,
  type: PropTypes.string,
};

export default TimeAgo;
