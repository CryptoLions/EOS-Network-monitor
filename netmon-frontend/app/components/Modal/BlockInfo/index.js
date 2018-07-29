// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import store from 'store';

// Components
import LoadingLine from '../../LoadingLine';

// Actions
import { modalActions } from '../../../bus/modal/actions';

// Selectors
import { selectBlockInfo } from '../../../bus/modal/selectors';
import { selectModalDataFetchingState } from '../../../bus/ui/selectors';

// Styles
import { Main, GetButton, Header, HeadBox, HeadText } from '../styles';
import { PreWrapper, ApiInput, HeadContainerBI } from './styles';

const mapStateToProps = createStructuredSelector({
  modalDataFetchingState: selectModalDataFetchingState(),
  blockInfo: selectBlockInfo(),
});

const mapDispatchToProps = dispach => ({
  actions: bindActionCreators(
    {
      fetchBlockInfo: modalActions.fetchBlockInfo,
    },
    dispach
  ),
});

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class BlockInfoModal extends PureComponent {
  state = {
    blockId: this.props.data || store.get('modal_blockInfo') || 1,
  };

  componentDidMount() {
    window.location.hash = `blockInfo:${this.state.blockId}`;
    this.getData();
  }

  componentWillUnmount() {
    window.location.hash = ``;
  }

  onFieldChange = e => this.setState({ [e.target.name]: e.target.value });

  getData = () => {
    const { blockId } = this.state;
    if (blockId) {
      if (!this.props.modalDataFetchingState) this.props.actions.fetchBlockInfo(blockId);
      store.set('modal_blockInfo', blockId);
    }
  };

  render() {
    const { blockId } = this.state;
    const { modalDataFetchingState, blockInfo } = this.props;

    return (
      <Fragment>
        <Header>
          <HeadBox>
            <HeadText>BLOCK INFO</HeadText>
          </HeadBox>
          <HeadContainerBI>
            <ApiInput value="'/v1/chain/get_block'" name="apiPath" readOnly />
            <ApiInput value={blockId} placeholder="Block id" name="apiData" onChange={this.onFieldChange} />
            <GetButton onClick={this.getData}>Get</GetButton>
          </HeadContainerBI>
        </Header>
        <LoadingLine state={modalDataFetchingState} />
        <Main>{!modalDataFetchingState && <PreWrapper>{JSON.stringify(blockInfo, null, 2)}</PreWrapper>}</Main>
      </Fragment>
    );
  }
}

BlockInfoModal.propTypes = {
  modalDataFetchingState: PropTypes.bool,
  actions: PropTypes.object,
  data: PropTypes.object,
  blockInfo: PropTypes.object,
};
