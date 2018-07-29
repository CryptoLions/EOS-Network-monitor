import { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

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

  getHumanTimeAgo = value => {
    const { ts } = this.state;

    if (!value) {
      return '--';
    }

    const diff = ts - value;
    if (diff < 0) {
      return '0sec';
    }
    if (diff < 60000) {
      return `${Math.floor(diff / 1000)}sec`;
    }
    const duration = moment.duration(ts - value);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    if (!hours && !minutes && !seconds) {
      return '0sec';
    }
    return `${hours ? `${hours}h ` : ''}${minutes ? `${minutes}m ` : ''}${seconds ? `${seconds}sec ` : ''}`;
  };

  render() {
    const { value } = this.props;

    return this.getHumanTimeAgo(value);
  }
}

TimeAgo.propTypes = {
  value: PropTypes.number,
};

export default TimeAgo;
