// Core
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

// Styles
import { TableHead, Tdata, ColumnMenuTdata, FixedCell } from './styles';
import TableColumnMenu from '../TableColumnMenu';

@translate()
export default class TableHeading extends PureComponent {
  render() {
    const { t, tableColumnState } = this.props;
    return (
      <TableHead>
        <tr>
          <FixedCell>{tableColumnState.name && t('i18nSecondSection.i18nFixedTableColumnNames.name')}</FixedCell>
          {tableColumnState.ping && <Tdata>{t('i18nSecondSection.i18nTableColumnNames.ping')}</Tdata>}
          {tableColumnState.answered && <Tdata>{t('i18nSecondSection.i18nTableColumnNames.answered')}</Tdata>}
          {tableColumnState.blkSeen && <Tdata>{t('i18nSecondSection.i18nTableColumnNames.blkSeen')}</Tdata>}
          {tableColumnState.produced && <Tdata>{t('i18nSecondSection.i18nTableColumnNames.produced')}</Tdata>}
          {tableColumnState.blkProduced && <Tdata>{t('i18nSecondSection.i18nTableColumnNames.blkProduced')}</Tdata>}
          {tableColumnState.version && <Tdata>{t('i18nSecondSection.i18nTableColumnNames.version')}</Tdata>}
          {tableColumnState.address && <Tdata>{t('i18nSecondSection.i18nTableColumnNames.address')}</Tdata>}
          {tableColumnState.http && <Tdata>{t('i18nSecondSection.i18nTableColumnNames.http')}</Tdata>}
          {tableColumnState.p2p && <Tdata>{t('i18nSecondSection.i18nTableColumnNames.p2p')}</Tdata>}
          {tableColumnState.location && <Tdata>{t('i18nSecondSection.i18nTableColumnNames.location')}</Tdata>}
          {tableColumnState.numberProduced && (
            <Tdata title="total blocks in blockchain produced by this name">
              {t('i18nSecondSection.i18nTableColumnNames.numberProduced')}
            </Tdata>
          )}
          {tableColumnState.txs && (
            <Tdata title="Processed transactions producer">{t('i18nSecondSection.i18nTableColumnNames.txs')}</Tdata>
          )}
          {tableColumnState.organisation && <Tdata>{t('i18nSecondSection.i18nTableColumnNames.organisation')}</Tdata>}
          {tableColumnState.votes && <Tdata>{t('i18nSecondSection.i18nTableColumnNames.votes')}</Tdata>}
          {tableColumnState.expectedIncome && (
            <Tdata>{t('i18nSecondSection.i18nTableColumnNames.expectedIncome')}</Tdata>
          )}
          {tableColumnState.missedBlocks && <Tdata>{t('i18nSecondSection.i18nTableColumnNames.missedBlocks')}</Tdata>}
          <ColumnMenuTdata>
            <TableColumnMenu />
          </ColumnMenuTdata>
        </tr>
      </TableHead>
    );
  }
}
TableHeading.propTypes = {
  t: PropTypes.func,
  tableColumnState: PropTypes.object,
};
