// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

// Eslint
/* eslint jsx-a11y/label-has-for:0 */

// Components
import TimeAgo from '../../../../../components/TimeAgo';
import DetailsRow from '../DetailsRow';

// Utils
import { formatNumber } from '../../../../../utils/intUtils';
import getColorByVersion from '../../../../../utils/getColorByVersion';

// Svg
import { DownArrow, ExternalLink } from './svg';

// Styles
import {
  Trow,
  Tdata,
  // cells
  CheckboxCell,
  IndexCell,
  VotesCell,
  OrganisationCell,
  // Ping
  PingCell,
  PingSpan,
  NameCell,
  TimeAgoCell,
  ArrowCell,
  VersionCell,
  AddressCell,
  // Others
  TextSpan,
  TextLink,
  TimeAgoBlock,
} from './styles';
import { Checkbox, StyledCheckbox, StyledCheckboxActive } from '../styles';

export default class TableRow extends PureComponent {
  state = {
    isArrowClicked: false,
    isPingUptated: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.producer && this.props.producer.ping !== nextProps.producer.ping) {
      this.setState({ isPingUptated: true });

      setTimeout(() => this.setState({ isPingUptated: false }), 1000);
    }
  }

  getProducerUrl = () => {
    const { producer } = this.props;

    if (
      !producer.organizationUrl ||
      producer.organizationUrl.length < 5 ||
      ['dev.cryptoions.io', 'eosnetworkmonitor.io'].indexOf(producer.organizationUrl) !== -1
    )
      return '--';

    if (producer.organizationUrl === 'cryptolions.io') return 'CryptoLions.io';

    if (producer.organizationUrl.indexOf('http') !== 0) return `http://${producer.url}`;

    return producer.organizationUrl;
  };

  versionColorsHandler = () => {
    const { producer } = this.props;
    if (producer.version) {
      const version = parseInt(`0x${producer.version}`, 16);
      return <VersionCell color={getColorByVersion(version)}>{version}</VersionCell>;
    }
    return <VersionCell />;
  };

  serverAddressHandler = (https, http, p2pHostname) => {
    const [hostname, port] = (https || http || '').split(':');

    return (
      <span>
        {hostname && port ? (
          <TextLink
            href={`${https ? 'https' : 'http'}://${
              hostname === '0.0.0.0' ? p2pHostname : hostname
            }:${port}/v1/chain/get_info`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {port}
          </TextLink>
        ) : null}
      </span>
    );
  };

  toggleProducerSelection = e => {
    const { producer, toggleProducerSelection } = this.props;

    toggleProducerSelection(producer.name, e.target.checked);
  };

  toggleArrowRotate = () => this.setState(({ isArrowClicked }) => ({ isArrowClicked: !isArrowClicked }));

  render() {
    const { isPingUptated, isArrowClicked } = this.state;
    const { producer, index, tableColumnState, toggleModal, isNodeChecked, colsNumber } = this.props;
    const node = producer.nodes && producer.nodes.length ? producer.nodes[0] : {};

    const producerUrl = this.getProducerUrl();
    const [p2pHostname, p2pPort] = (node.p2p_server_address || '').split(':');

    let backgroundColor;
    if (producer.isCurrentNode) backgroundColor = 'rgb(17, 168, 39, 0.7)';
    if (!producer.isNode && index < 61) backgroundColor = 'rgb(211, 211, 211)';
    if (producer.isNodeBroken) backgroundColor = 'rgb(255, 4, 4, 0.7)';
    if (producer.isUnsynced) backgroundColor = 'rgb(159, 100, 227)';

    return (
      <Fragment>
        <Trow style={{ backgroundColor }}>
          {/* {#} */}
          <CheckboxCell>
            <label>
              <Checkbox type="checkbox" checked={isNodeChecked} onChange={this.toggleProducerSelection} />
              {isNodeChecked ? <StyledCheckboxActive /> : <StyledCheckbox />}
            </label>
          </CheckboxCell>
          <IndexCell>{producer.index + 1}</IndexCell>
          {tableColumnState.ping && (
            <PingCell>
              <PingSpan isPingUptated={isPingUptated}>{`${producer.ping || '--'}ms`}</PingSpan>
            </PingCell>
          )}
          {/* {1.Name} */}
          {tableColumnState.name && (
            <NameCell>
              <TextLink onClick={() => toggleModal('accountInfo', producer.name)}>{producer.name}</TextLink>
              <ExternalLink link={producerUrl} />
            </NameCell>
          )}
          {/* {2.Answered} */}
          {tableColumnState.answered && (
            <TimeAgoCell>
              <TimeAgoBlock>
                <TimeAgo value={producer.answeredTimestamp} />
              </TimeAgoBlock>
            </TimeAgoCell>
          )}
          {/* {3.Blk seen} */}
          {tableColumnState.blkSeen && <Tdata>{producer.answeredBlock}</Tdata>}
          {/* {4.Produced} */}
          {tableColumnState.produced && (
            <TimeAgoCell>
              <TimeAgoBlock>
                <TimeAgo value={producer.producedTimestamp} />
              </TimeAgoBlock>
            </TimeAgoCell>
          )}
          {/* {5.Blk produced} */}
          {tableColumnState.blkProduced && <Tdata>{producer.producedBlock}</Tdata>}
          {/* {6.Version} */}
          {tableColumnState.version && this.versionColorsHandler()}
          {/* {7.Address} */}
          {tableColumnState.address && <AddressCell>{p2pHostname}</AddressCell>}
          {/* {8.HTTP} */}
          {tableColumnState.http && (
            <Tdata>{this.serverAddressHandler(node.https_server_address, node.http_server_address, p2pHostname)}</Tdata>
          )}
          {/* {9.P2P} */}
          {tableColumnState.p2p && <Tdata>{p2pPort}</Tdata>}
          {/* {10.Location} */}
          {tableColumnState.location && <Tdata>{node.location}</Tdata>}
          {/* {11.# produced} */}
          {tableColumnState.numberProduced && <Tdata>{producer.produced}</Tdata>}
          {/* {12.TXs} */}
          {tableColumnState.txs && <Tdata>{producer.tx_count}</Tdata>}
          {/* {13.Organisation} */}
          {tableColumnState.organisation && (
            <OrganisationCell>
              <TextLink href={producerUrl} target="_blank" rel="noopener noreferrer">
                {node.organisation}
              </TextLink>
            </OrganisationCell>
          )}
          {/* {14.Votes} */}
          {tableColumnState.votes && (
            <VotesCell>
              {formatNumber(producer.votesInEOS)} <TextSpan>{`${formatNumber(producer.votesPercentage)}%`}</TextSpan>
            </VotesCell>
          )}
          <ArrowCell onClick={this.toggleArrowRotate}>
            <DownArrow isArrowClicked={isArrowClicked} />
          </ArrowCell>
        </Trow>
        {isArrowClicked && (
          <DetailsRow
            colsNumber={colsNumber}
            isPingUptated={isPingUptated}
            producer={producer}
            toggleModal={toggleModal}
            producerUrl={producerUrl}
            p2pHostname={p2pHostname}
            p2pPort={p2pPort}
            node={node}
            serverAddressHandler={this.serverAddressHandler}
          />
        )}
      </Fragment>
    );
  }
}

TableRow.propTypes = {
  producer: PropTypes.object,
  index: PropTypes.number,
  tableColumnState: PropTypes.object,
  toggleModal: PropTypes.func,
  toggleProducerSelection: PropTypes.func,
  isNodeChecked: PropTypes.bool,
  colsNumber: PropTypes.number,
};
