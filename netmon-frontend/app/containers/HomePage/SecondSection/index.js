// Core
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { translate } from 'react-i18next';

// Components
import FilterInput from './FilterInput';
import Table from './Table';

// Actions
import { producerActions } from '../../../bus/producers/actions';
import { uiActions } from '../../../bus/ui/actions';

// Selectors
import { selectFilterInputValue } from '../../../bus/producers/selectors';

// Styles
import { SectionTwo, Intumentary, ButtonVote } from './styles';

const mapStateToProps = createStructuredSelector({
  // modal filter
  filterInputValue: selectFilterInputValue(),
});

const mapDispatchToProps = dispach => ({
  actions: bindActionCreators(
    {
      setFilterInputValue: producerActions.setFilterInputValue,
      toggleModal: uiActions.toggleModal,
    },
    dispach
  ),
});

@connect(
  mapStateToProps,
  mapDispatchToProps
)
@translate()
export default class SecondSection extends PureComponent {
  showVoteModal = () => this.props.actions.toggleModal('vote', null);

  render() {
    const {
      t,
      filterInputValue,
      actions: { setFilterInputValue },
    } = this.props;
    return (
      <SectionTwo>
        <Intumentary>
          <ButtonVote onClick={this.showVoteModal}>{t('i18nSecondSection.i18nVote')}</ButtonVote>
          <FilterInput filterInputValue={filterInputValue} setFilterInputValue={setFilterInputValue} />
        </Intumentary>
        <Table />
      </SectionTwo>
    );
  }
}

SecondSection.propTypes = {
  t: PropTypes.func,
  // FilterInput
  filterInputValue: PropTypes.string,
  actions: PropTypes.object,
};
