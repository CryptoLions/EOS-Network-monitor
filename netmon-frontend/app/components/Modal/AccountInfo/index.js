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
import { uiActions } from '../../../bus/ui/actions';
import { modalActions } from '../../../bus/modal/actions';

// Selectors
import { selectModalDataFetchingState } from '../../../bus/ui/selectors';
import { selectAccountInfo } from '../../../bus/modal/selectors';

// Utils
import { convertUtcToLocal } from '../../../utils/dateUtils';

// Styles
import {
  Input,
  GetButton,
  Header,
  HeadContainer,
  HeadBox,
  HeadText,
  Main,
  Link,
  TextSpan,
  TextSpanBold,
  InputsDiv,
} from '../styles';
import { InfoContainer, DataBlock } from './styles';

const mapStateToProps = createStructuredSelector({
  modalDataFetchingState: selectModalDataFetchingState(),
  accountInfo: selectAccountInfo(),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      fetchAccountInfo: modalActions.fetchAccountInfo,
      toggleModal: uiActions.toggleModal,
    },
    dispatch
  ),
});

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class AccountInfo extends PureComponent {
  state = {
    producerName: this.props.accountName || store.get('modal_accountInfo') || 'eoshuobipool',
  };

  componentDidMount() {
    window.location.hash = `accountInfo:${this.state.producerName}`;
    this.getData();
  }

  componentWillUnmount() {
    window.location.hash = ``;
  }

  onAccountNameChange = e => this.setState({ producerName: e.target.value });

  getData = () => {
    const { producerName } = this.state;
    const { modalDataFetchingState, actions } = this.props;
    if (producerName) {
      if (!modalDataFetchingState) actions.fetchAccountInfo(producerName);
      store.set('modal_accountInfo', producerName);
    }
  };

  render() {
    const { producerName } = this.state;
    const {
      modalDataFetchingState,
      accountInfo,
      actions: { toggleModal },
    } = this.props;

    return (
      <Fragment>
        <Header>
          <HeadBox>
            <HeadText>ACCOUNT INFO</HeadText>
          </HeadBox>
          <HeadContainer>
            <InputsDiv>
              <Input value={producerName} placeholder="Account Name" onChange={this.onAccountNameChange} />
              <GetButton onClick={this.getData}>Get</GetButton>
            </InputsDiv>
            <span>
              Get accounts transactions history.{' '}
              <Link onClick={() => toggleModal('accountHistory', producerName)}>History</Link>
            </span>
          </HeadContainer>
        </Header>
        <LoadingLine state={modalDataFetchingState} />
        <Main>
          {!modalDataFetchingState &&
            !!Object.keys(accountInfo).length && (
              <InfoContainer>
                <DataBlock>
                  <TextSpanBold>Balance:</TextSpanBold>
                  <TextSpan>{typeof accountInfo.balance === 'undefined' ? '--' : accountInfo.balance}</TextSpan>
                </DataBlock>
                <DataBlock>
                  <div>
                    <TextSpanBold>Created:</TextSpanBold>
                    {convertUtcToLocal(accountInfo.created) || '--'}
                  </div>
                  <div>
                    <TextSpanBold>Last code Update:</TextSpanBold>
                    {convertUtcToLocal(accountInfo.last_code_update) || '--'}
                  </div>
                </DataBlock>
                <DataBlock>
                  {accountInfo.permissions[0].required_auth.keys[0] && (
                    <div>
                      <TextSpanBold>Active Key:</TextSpanBold>
                      {accountInfo.permissions[0].required_auth.keys[0].key || '--'}
                    </div>
                  )}
                  {accountInfo.permissions[1].required_auth.keys[0] && (
                    <div>
                      <TextSpanBold>Owner Key:</TextSpanBold>
                      {accountInfo.permissions[1].required_auth.keys[0].key || '--'}
                    </div>
                  )}
                </DataBlock>
                <DataBlock>
                  <div>
                    <TextSpanBold>RAM used:</TextSpanBold> {accountInfo.ram_usage || '--'} bytes / quota:{' '}
                    {accountInfo.total_resources.ram_bytes || '--'} bytes
                  </div>
                </DataBlock>
                <DataBlock>
                  <div>
                    <TextSpanBold>NET bandwidth:</TextSpanBold>
                  </div>
                  <div>
                    <TextSpanBold>staked:</TextSpanBold>
                    {(accountInfo.self_delegated_bandwidth && accountInfo.self_delegated_bandwidth.net_weight) || '--'}
                  </div>
                  <div>
                    <TextSpanBold>delegated:</TextSpanBold>
                    {accountInfo.total_resources.net_weight || '--'}
                  </div>
                  <div>
                    <TextSpanBold>current:</TextSpanBold>
                    {accountInfo.net_limit.used || '--'} / <TextSpanBold>available:</TextSpanBold>
                    {accountInfo.net_limit.available || '--'} bytes
                  </div>
                  <div>
                    <TextSpanBold>max:</TextSpanBold>
                    {accountInfo.net_limit.max || '--'} bytes
                  </div>
                </DataBlock>
                <DataBlock>
                  <div>
                    <TextSpanBold>CPU bandwidth:</TextSpanBold>
                  </div>
                  <div>
                    <TextSpanBold>staked:</TextSpanBold>
                    {(accountInfo.self_delegated_bandwidth && accountInfo.self_delegated_bandwidth.cpu_weight) || '--'}
                  </div>
                  <div>
                    <TextSpanBold>delegated:</TextSpanBold> {accountInfo.total_resources.cpu_weight || '--'}
                  </div>
                  <div>
                    <TextSpanBold>current:</TextSpanBold> {accountInfo.cpu_limit.used || '--'} /{' '}
                    <TextSpanBold>available:</TextSpanBold> {accountInfo.cpu_limit.available || '--'} time
                  </div>
                  <div>
                    <TextSpanBold>max:</TextSpanBold> {accountInfo.cpu_limit.max || '--'} time
                  </div>
                </DataBlock>
                {!!accountInfo.voter_info && (
                  <DataBlock>
                    <div>
                      <TextSpanBold>Voter Info:</TextSpanBold> {accountInfo.voter_info.owner || '--'}
                    </div>
                    <div>
                      <TextSpanBold>Proxy:</TextSpanBold> {accountInfo.voter_info.proxy || '--'}
                    </div>
                    <div>
                      <TextSpanBold>Producers:</TextSpanBold> {accountInfo.voter_info.producers.length || '--'}
                    </div>
                    <div>
                      <TextSpanBold>Staked:</TextSpanBold> {accountInfo.voter_info.staked || '--'}
                    </div>
                    <div>
                      <TextSpanBold>Last vote weight:</TextSpanBold> {accountInfo.voter_info.last_vote_weight || '--'}
                    </div>
                    <div>
                      <TextSpanBold>Proxie vote weight:</TextSpanBold>{' '}
                      {accountInfo.voter_info.proxied_vote_weight || '--'}
                    </div>
                    <div>
                      <TextSpanBold>Is proxy:</TextSpanBold> {accountInfo.voter_info.is_proxy || 0}
                    </div>
                    <div>
                      <TextSpanBold>Deferred trx id:</TextSpanBold> {accountInfo.voter_info.deferred_trx_id || '--'}
                    </div>
                    <div>
                      <TextSpanBold>Last unstake time:</TextSpanBold> {accountInfo.voter_info.last_unstake_time || '--'}
                    </div>
                    <div>
                      <TextSpanBold>Unstaking:</TextSpanBold> {accountInfo.unstaking || '--'}
                    </div>
                  </DataBlock>
                )}
              </InfoContainer>
            )}
        </Main>
      </Fragment>
    );
  }
}

AccountInfo.propTypes = {
  modalDataFetchingState: PropTypes.bool,
  actions: PropTypes.object,
  accountInfo: PropTypes.object,
  accountName: PropTypes.string,
};
