import React from 'react';

import { THROTTLE_TIMEOUT } from '../../constants';

const renderEnhancer = Component =>
  class EnchancedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.lastUpdatedTs = Date.now();
    }

    shouldComponentUpdate() {
      const currentTs = Date.now();
      if (currentTs - this.lastUpdatedTs > THROTTLE_TIMEOUT) {
        this.lastUpdatedTs = currentTs;

        return true;
      }

      return false;
    }

    render() {
      return <Component {...this.props} />;
    }
  };

export default renderEnhancer;
