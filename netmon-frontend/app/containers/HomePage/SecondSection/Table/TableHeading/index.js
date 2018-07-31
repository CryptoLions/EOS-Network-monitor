// Core
import React from 'react';
import PropTypes from 'prop-types';

// Styles
import { TableHead, Tdata, ColumnMenuTdata } from './styles';
import TableColumnMenu from '../TableColumnMenu';

export const TableHeading = ({ tableColumnState }) => (
  <TableHead>
    <tr>
      <Tdata />
      <Tdata />
      {tableColumnState.ping && <Tdata>Ping</Tdata>}
      {tableColumnState.name && <Tdata>Name</Tdata>}
      {tableColumnState.answered && <Tdata>Answered</Tdata>}
      {tableColumnState.blkSeen && <Tdata>Blk seen</Tdata>}
      {tableColumnState.produced && <Tdata>Produced</Tdata>}
      {tableColumnState.blkProduced && <Tdata>Blk produced</Tdata>}
      {tableColumnState.version && <Tdata>Version</Tdata>}
      {tableColumnState.address && <Tdata>Address</Tdata>}
      {tableColumnState.http && <Tdata>HTTP</Tdata>}
      {tableColumnState.p2p && <Tdata>P2P</Tdata>}
      {tableColumnState.location && <Tdata>Location</Tdata>}
      {tableColumnState.numberProduced && (
        <Tdata title="total blocks in blockchain produced by this name"># produced</Tdata>
      )}
      {tableColumnState.txs && <Tdata title="Processed transactions producer">TXs</Tdata>}
      {tableColumnState.organisation && <Tdata>Organisation</Tdata>}
      {tableColumnState.votes && <Tdata>Votes</Tdata>}
      <ColumnMenuTdata>
        <TableColumnMenu />
      </ColumnMenuTdata>
    </tr>
  </TableHead>
);

TableHeading.propTypes = {
  tableColumnState: PropTypes.object,
};
