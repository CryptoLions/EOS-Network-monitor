// Core
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import TimeAgo from '../../../../../components/TimeAgo';
import ServerAddress from '../../../../../components/ServerAddress';

// Utils
import { formatNumber } from '../../../../../utils/intUtils';

// Constants
import { API_KEY } from '../../../../../constants';

// Svg
import { ExternalLink } from '../TableRow/svg';

// Styles
import {
  Trow,
  // Ping
  PingSpanBold,
  // Details
  DetailsDiv,
  DetailsList,
  DetailsListItem,
  DetailsTextSpan,
  Map,
  MapWrapper,
  // Others
  TextLink,
  Bold,
} from './styles';

export default class DetailsRow extends PureComponent {
  versionHandler = () => {
    const { producer } = this.props;
    if (producer.version) {
      return parseInt(`0x${producer.version}`, 16);
    }
    return null;
  };

  render() {
    const { colsNumber, isPingUptated, producer, toggleModal, producerUrl, address, p2pPort } = this.props;
    const node = producer.nodes && producer.nodes.length ? producer.nodes[0] : {};
    return (
      <Trow>
        <td colSpan={colsNumber + 3}>
          <DetailsDiv>
            <DetailsList>
              <DetailsListItem>
                Ping:
                <PingSpanBold isPingUptated={isPingUptated}>{`${producer.ping || '--'}ms`}</PingSpanBold>
              </DetailsListItem>
              <DetailsListItem>
                Name:
                <TextLink onClick={() => toggleModal('accountInfo', producer.name)}>
                  <Bold>{producer.name}</Bold>
                </TextLink>
                <ExternalLink link={producerUrl} />
              </DetailsListItem>
              <DetailsListItem>
                Answered:
                <Bold>
                  <TimeAgo value={producer.answeredTimestamp} />
                </Bold>
              </DetailsListItem>
              <DetailsListItem>
                Blk seen:
                <Bold>{producer.answeredBlock}</Bold>
              </DetailsListItem>
              <DetailsListItem>
                Produced:
                <Bold>
                  <TimeAgo value={producer.producedTimestamp} />
                </Bold>
              </DetailsListItem>
            </DetailsList>
            <DetailsList>
              <DetailsListItem>
                Blk produced:
                <Bold>{producer.producedBlock}</Bold>
              </DetailsListItem>
              <DetailsListItem>
                Version:
                <Bold>{this.versionHandler()}</Bold>
              </DetailsListItem>
              <DetailsListItem>
                Address:
                <Bold>{address}</Bold>
              </DetailsListItem>
              <DetailsListItem>
                HTTP:
                <Bold>
                  <ServerAddress nodes={producer.nodes} />
                </Bold>
              </DetailsListItem>
              <DetailsListItem>
                P2P:
                <Bold>{p2pPort}</Bold>
              </DetailsListItem>
            </DetailsList>
            <DetailsList>
              <DetailsListItem>
                Location:
                <Bold>{node.location}</Bold>
              </DetailsListItem>
              <DetailsListItem>
                # produced:
                <Bold>{producer.produced}</Bold>
              </DetailsListItem>
              <DetailsListItem>
                TXs
                <Bold>{producer.tx_count}</Bold>
              </DetailsListItem>
              <DetailsListItem>
                Org Name:
                <Bold>
                  <TextLink href={producerUrl} target="_blank" rel="noopener noreferrer">
                    {node.organisation}
                  </TextLink>
                </Bold>
              </DetailsListItem>
              <DetailsListItem>
                Votes:
                <Bold>
                  {formatNumber(producer.votesInEOS)}{' '}
                  <DetailsTextSpan>{`${formatNumber(producer.votesPercentage)}%`}</DetailsTextSpan>
                </Bold>
              </DetailsListItem>
            </DetailsList>
            <MapWrapper>
              {node.location && (
                <Map
                  src={`https://maps.googleapis.com/maps/api/staticmap?markers=${
                    node.location
                  }&zoom=2&size=170x104&scale=2&key=${API_KEY}`}
                  alt="location"
                />
              )}
            </MapWrapper>
          </DetailsDiv>
        </td>
      </Trow>
    );
  }
}

DetailsRow.propTypes = {
  colsNumber: PropTypes.number,
  isPingUptated: PropTypes.bool,
  producer: PropTypes.object,
  address: PropTypes.string,
  toggleModal: PropTypes.func,
  producerUrl: PropTypes.string,
  p2pPort: PropTypes.string,
};
