import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextLink } from './styles';

class ServerAddress extends PureComponent {
  render() {
    const { nodes } = this.props;

    if (!nodes) {
      return null;
    }
    const nodeWithHostname = nodes.find(node => node.https_server_address || node.http_server_address);

    if (!nodeWithHostname) {
      return null;
    }

    const { http_server_address: http, https_server_address: https, p2p_server_address: p2pAddress } = nodeWithHostname;
    const p2pHost = p2pAddress && p2pAddress.split(':')[0];
    const [hostname, port] = (https || http).split(':');

    return (
      <span>
        {
          <TextLink
            href={`${https ? 'https' : 'http'}://${
              hostname === '0.0.0.0' ? p2pHost : hostname
            }:${port}/v1/chain/get_info`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {port}
          </TextLink>
        }
      </span>
    );
  }
}

ServerAddress.propTypes = {
  nodes: PropTypes.array,
};

export default ServerAddress;
