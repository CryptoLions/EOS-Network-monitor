// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

// Eslint
/* eslint jsx-a11y/label-has-for:0 */

// Components
import TimeAgo from '../../../../../components/TimeAgo';
import ServerAddress from '../../../../../components/ServerAddress';
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
  VotesCell,
  OrgNameCell,
  // Ping
  PingCell,
  PingSpan,
  StyledSpan,
  NameCell,
  TimeAgoCell,
  ArrowCell,
  VersionCell,
  AddressCell,
  // Others
  NameBlock,
  NameWrapper,
  LabelWrapper,
  Index,
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

  extractCorrectAddress = nodes => {
    if (!nodes) {
      return '';
    }
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const [p2pHostname] = (node.p2p_server_address || '').split(':');
      if (p2pHostname) {
        return p2pHostname;
      }
      const [httpHostname] = (node.http_server_address || '').split(':');
      if (httpHostname) {
        return httpHostname;
      }
      const [httpsHostname] = (node.https_server_address || '').split(':');
      if (httpsHostname) {
        return httpsHostname;
      }
    }
    return '';
  };

  pingColorsHandler = () => {
    const { producer } = this.props;

    if (producer.ping) {
      return <StyledSpan color={producer.ping > 1000 ? '#f2d24b' : undefined}>{`${producer.ping}ms`}</StyledSpan>;
    }
    return <StyledSpan color="#ff5456">--</StyledSpan>;
  };

  blkSeenColorsHandler = () => {
    const { producer, headBlockNum } = this.props;
    const difference = headBlockNum - producer.answeredBlock;
    let color;
    if (difference > 252) {
      color = '#ff5456';
    } else if (difference > 126) {
      color = '#f2d24b';
    }
    return <StyledSpan color={color}>{producer.answeredBlock}</StyledSpan>;
  };

  extractCorrectP2pPort = nodes => {
    if (!nodes) {
      return '';
    }
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const port = (node.p2p_server_address || '').split(':')[1];
      if (port && port.length > 0) {
        return port;
      }
    }
    return '';
  };

  toggleProducerSelection = e => {
    const { producer, toggleProducerSelection } = this.props;

    toggleProducerSelection(producer.name, e.target.checked);
  };

  toggleArrowRotate = () => this.setState(({ isArrowClicked }) => ({ isArrowClicked: !isArrowClicked }));

  render() {
    const { isPingUptated, isArrowClicked } = this.state;
    const { producer, index, tableColumnState, toggleModal, isNodeChecked, colsNumber, isTableScrolled } = this.props;
    const node = producer.nodes && producer.nodes.length ? producer.nodes[0] : {};
    const { nodes } = producer;

    const producerUrl = this.getProducerUrl();
    const p2pPort = this.extractCorrectP2pPort(nodes);
    const address = this.extractCorrectAddress(nodes);

    let backgroundColor;
    if (producer.isCurrentNode) backgroundColor = 'rgba(17, 168, 39, 0.7)';
    if (!producer.isNode && index < 61) backgroundColor = 'rgb(211, 211, 211)';
    if (producer.isNodeBroken) backgroundColor = 'rgba(255, 4, 4, 0.7)';
    if (producer.isUnsynced) backgroundColor = 'rgb(159, 100, 227)';

    let backgroundColorFixedCell;
    if (isTableScrolled) {
      backgroundColorFixedCell = '#fff';
      if (producer.isCurrentNode) backgroundColorFixedCell = 'rgb(17, 168, 39)';
      if (!producer.isNode && index < 61) backgroundColorFixedCell = 'rgb(211, 211, 211)';
      if (producer.isNodeBroken) backgroundColorFixedCell = 'rgb(255, 4, 4)';
      if (producer.isUnsynced) backgroundColorFixedCell = 'rgb(159, 100, 227)';
    }

    return (
      <Fragment>
        <Trow style={{ backgroundColor }}>
          {/* {#} {1.Name} */}
          <NameCell style={{ backgroundColor: backgroundColorFixedCell }}>
            <NameBlock>
              <LabelWrapper>
                <label>
                  <Checkbox type="checkbox" checked={isNodeChecked} onChange={this.toggleProducerSelection} />
                  {isNodeChecked ? <StyledCheckboxActive /> : <StyledCheckbox />}
                </label>
              </LabelWrapper>
              <Index>{producer.index + 1}</Index>
              <NameWrapper>
                <TextLink onClick={() => toggleModal('accountInfo', producer.name)}>{producer.name}</TextLink>
                <ExternalLink link={producerUrl} />
              </NameWrapper>
            </NameBlock>
          </NameCell>
          {tableColumnState.ping && (
            <PingCell>
              <PingSpan isPingUptated={isPingUptated}>{this.pingColorsHandler()}</PingSpan>
            </PingCell>
          )}
          {/* {2.Answered} */}
          {tableColumnState.answered && (
            <TimeAgoCell>
              <TimeAgoBlock>
                <TimeAgo value={producer.answeredTimestamp} type="answered" />
              </TimeAgoBlock>
            </TimeAgoCell>
          )}
          {/* {3.Blk seen} */}
          {tableColumnState.blkSeen && <Tdata>{this.blkSeenColorsHandler()}</Tdata>}
          {/* {4.Produced} */}
          {tableColumnState.produced && (
            <TimeAgoCell>
              <TimeAgoBlock>
                {producer.isCurrentNode ? '0sec' : <TimeAgo value={producer.producedTimestamp} />}
              </TimeAgoBlock>
            </TimeAgoCell>
          )}

          {/* {5.Blk produced} */}
          {tableColumnState.blkProduced && <Tdata>{producer.producedBlock}</Tdata>}
          {/* {6.Version} */}
          {tableColumnState.version && this.versionColorsHandler()}
          {/* {7.Address} */}
          {tableColumnState.address && <AddressCell>{address}</AddressCell>}
          {/* {8.HTTP} */}
          {tableColumnState.http && (
            <Tdata>
              <ServerAddress nodes={nodes} />
            </Tdata>
          )}
          {/* {9.P2P} */}
          {tableColumnState.p2p && <Tdata>{p2pPort}</Tdata>}
          {/* {10.Location} */}
          {tableColumnState.location && <Tdata>{node.location}</Tdata>}
          {/* {11.# produced} */}
          {tableColumnState.numberProduced && <Tdata>{producer.produced}</Tdata>}
          {/* {12.# TXs} */}
          {tableColumnState.txs && <Tdata>{producer.tx_count}</Tdata>}
          {/* {13.Org Name} */}
          {tableColumnState.organisation && (
            <OrgNameCell>
              <TextLink href={producerUrl} target="_blank" rel="noopener noreferrer">
                {node.organisation}
              </TextLink>
            </OrgNameCell>
          )}
          {/* {14.Votes} */}
          {tableColumnState.votes && (
            <VotesCell>
              {formatNumber(producer.votesInEOS)} <TextSpan>{`${formatNumber(producer.votesPercentage)}%`}</TextSpan>
            </VotesCell>
          )}
          {/* {15.Expected income} */}
          {tableColumnState.expectedIncome && <VotesCell>{formatNumber(producer.rewards_per_day)} </VotesCell>}
          {/* {16.Missed blocks} */}
          {tableColumnState.missedBlocks && <VotesCell>{formatNumber(producer.missedBlocks)} </VotesCell>}
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
            address={address}
            p2pPort={p2pPort}
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
  headBlockNum: PropTypes.number,
  toggleModal: PropTypes.func,
  toggleProducerSelection: PropTypes.func,
  isNodeChecked: PropTypes.bool,
  isTableScrolled: PropTypes.bool,
  colsNumber: PropTypes.number,
};
