// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import store from 'store';
import isEqual from 'lodash/isEqual';

// Components
import { TableHeading } from './TableHeading';
import TableData from './TableData';

// Actions
import { uiActions } from '../../../../bus/ui/actions';
import { producerActions } from '../../../../bus/producers/actions';

// Selectors
import { selectProducers, selectFilterInputValue, selectCheckedProducers } from '../../../../bus/producers/selectors';
import { selectTableColumnState } from '../../../../bus/ui/selectors';

// Utils
import renderEnhancer from '../../../../hoc/renderEnhancer';

// Styles
import { TableContainer, TableTag, Filler, NoDataDiv } from './styles';

const mapStateToProps = createStructuredSelector({
  // ui
  tableColumnState: selectTableColumnState(),
  // table
  producers: selectProducers(),
  // checkbox state
  selectedProducers: selectCheckedProducers(),
  // Filter table value
  filterInputValue: selectFilterInputValue(),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      toggleProducerSelection: producerActions.toggleProducerSelection,
      toggleModal: uiActions.toggleModal,
    },
    dispatch
  ),
});

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Table extends PureComponent {
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedProducers.length !== this.props.selectedProducers.length)
      store.set('checkedProducers', nextProps.selectedProducers);

    if (!isEqual(nextProps.tableColumnState, this.props.tableColumnState)) {
      store.set('tableColumnState', nextProps.tableColumnState);
      this.visibleColumnsChanged = true;
    }
  }

  componentDidUpdate() {
    if (this.visibleColumnsChanged) {
      console.log(this.table.offsetWidth - this.tableContainer.offsetWidth);
      this.tableContainer.scrollLeft = this.table.offsetWidth - this.tableContainer.offsetWidth;
      this.visibleColumnsChanged = false;
    }
  }

  filterHandler = producers => {
    if (!this.props.filterInputValue) return producers;

    const lowerCaseSearch = this.props.filterInputValue.toLowerCase();
    return producers.filter(producer => producer.name.toLowerCase().includes(lowerCaseSearch));
  };

  render() {
    const {
      producers,
      tableColumnState,
      actions: { toggleModal, toggleProducerSelection },
      selectedProducers,
      filterInputValue,
    } = this.props;

    const filteredProducers = this.filterHandler(producers);
    return (
      <Fragment>
        {/* @TODO redesign */}
        <TableContainer
          innerRef={el => {
            this.tableContainer = el;
          }}
        >
          <TableTag
            innerRef={el => {
              this.table = el;
            }}
          >
            <TableHeading tableColumnState={tableColumnState} />
            <tbody>
              {filteredProducers.length !== 0 &&
                filteredProducers.map((producer, index) => (
                  <Fragment key={producer.name}>
                    {index === 21 && !filterInputValue && <Filler />}
                    <TableData
                      producer={producer}
                      isNodeChecked={selectedProducers.some(item => item === producer.name)}
                      tableColumnState={tableColumnState}
                      toggleModal={toggleModal}
                      toggleProducerSelection={toggleProducerSelection}
                    />
                  </Fragment>
                ))}
            </tbody>
          </TableTag>
          {!filteredProducers.length && <NoDataDiv>No data found</NoDataDiv>}
        </TableContainer>
      </Fragment>
    );
  }
}

Table.propTypes = {
  producers: PropTypes.array,
  selectedProducers: PropTypes.array,
  tableColumnState: PropTypes.object,
  actions: PropTypes.object,
  filterInputValue: PropTypes.string,
};

export default renderEnhancer(Table);
