// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import store from 'store';
import { translate } from 'react-i18next';

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
@translate()
export default class AccountInfo extends PureComponent {
  state = {
    producerName: this.props.accountName || store.get('modal_accountInfo') || 'eoshuobipool',
  };

  componentDidMount() {
    window.location.hash = `accountInfo:${this.state.producerName}`;
    this.getData();
  }

  componentWillUnmount() {
    const yScroll = window.pageYOffset;
    window.location.hash = ``;
    window.scroll(0, yScroll);
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
      t,
      modalDataFetchingState,
      accountInfo,
      actions: { toggleModal },
    } = this.props;

    return (
      <Fragment>
        <Header>
          <HeadBox>
            <HeadText>{t('i18nModal.i18nAccountInfo.title')}</HeadText>
          </HeadBox>
          <HeadContainer>
            <InputsDiv>
              <Input
                value={producerName}
                placeholder={t('i18nModal.i18nAccountInfo.placeholder')}
                onChange={this.onAccountNameChange}
              />
              <GetButton onClick={this.getData}>{t('i18nModal.i18nAccountInfo.getButton')}</GetButton>
            </InputsDiv>
            <span>
              {t('i18nModal.i18nAccountInfo.getAccountsTransactionsHistory')}.{' '}
              <Link onClick={() => toggleModal('accountHistory', producerName)}>
                {t('i18nModal.i18nAccountInfo.historyLink')}
              </Link>
            </span>
          </HeadContainer>
        </Header>
        <LoadingLine state={modalDataFetchingState} />
        <Main>
          {!modalDataFetchingState &&
            !!Object.keys(accountInfo).length && (
              <InfoContainer>
                <DataBlock>
                  <TextSpanBold>{t('i18nModal.i18nAccountInfo.balance')}:</TextSpanBold>
                  <TextSpan>{typeof accountInfo.balance === 'undefined' ? '--' : accountInfo.balance}</TextSpan>
                </DataBlock>
                <DataBlock>
                  <div>
                    <TextSpanBold>{t('i18nModal.i18nAccountInfo.created')}:</TextSpanBold>
                    {convertUtcToLocal(accountInfo.created) || '--'}
                  </div>
                  <div>
                    <TextSpanBold>{t('i18nModal.i18nAccountInfo.lastCodeUpdate')}:</TextSpanBold>
                    {convertUtcToLocal(accountInfo.last_code_update) || '--'}
                  </div>
                </DataBlock>
                <DataBlock>
                  {accountInfo.permissions[0].required_auth.keys[0] && (
                    <div>
                      <TextSpanBold>{t('i18nModal.i18nAccountInfo.activeKey')}:</TextSpanBold>
                      {accountInfo.permissions[0].required_auth.keys[0].key || '--'}
                    </div>
                  )}
                  {accountInfo.permissions[1].required_auth.keys[0] && (
                    <div>
                      <TextSpanBold>{t('i18nModal.i18nAccountInfo.ownerKey')}:</TextSpanBold>
                      {accountInfo.permissions[1].required_auth.keys[0].key || '--'}
                    </div>
                  )}
                </DataBlock>
                <DataBlock>
                  <div>
                    <TextSpanBold>{t('i18nModal.i18nAccountInfo.ramUsed')}:</TextSpanBold>{' '}
                    {accountInfo.ram_usage || '--'} {t('i18nModal.i18nAccountInfo.bytes')} /{' '}
                    {t('i18nModal.i18nAccountInfo.quota')}: {accountInfo.total_resources.ram_bytes || '--'}{' '}
                    {t('i18nModal.i18nAccountInfo.bytes')}
                  </div>
                </DataBlock>
                <DataBlock>
                  <div>
                    <TextSpanBold>{t('i18nModal.i18nAccountInfo.netBandwidth')}:</TextSpanBold>
                  </div>
                  <div>
                    <TextSpanBold>{t('i18nModal.i18nAccountInfo.staked')}:</TextSpanBold>
                    {(accountInfo.self_delegated_bandwidth && accountInfo.self_delegated_bandwidth.net_weight) || '--'}
                  </div>
                  <div>
                    <TextSpanBold>{t('i18nModal.i18nAccountInfo.delegated')}:</TextSpanBold>
                    {accountInfo.total_resources.net_weight || '--'}
                  </div>
                  <div>
                    <TextSpanBold>{t('i18nModal.i18nAccountInfo.current')}:</TextSpanBold>
                    {accountInfo.net_limit.used || '--'} /{' '}
                    <TextSpanBold>{t('i18nModal.i18nAccountInfo.available')}:</TextSpanBold>
                    {accountInfo.net_limit.available || '--'} {t('i18nModal.i18nAccountInfo.bytes')}
                  </div>
                  <div>
                    <TextSpanBold>{t('i18nModal.i18nAccountInfo.max')}:</TextSpanBold>
                    {accountInfo.net_limit.max || '--'} {t('i18nModal.i18nAccountInfo.bytes')}
                  </div>
                </DataBlock>
                <DataBlock>
                  <div>
                    <TextSpanBold>{t('i18nModal.i18nAccountInfo.cpuBandwidth')}:</TextSpanBold>
                  </div>
                  <div>
                    <TextSpanBold>{t('i18nModal.i18nAccountInfo.staked')}:</TextSpanBold>
                    {(accountInfo.self_delegated_bandwidth && accountInfo.self_delegated_bandwidth.cpu_weight) || '--'}
                  </div>
                  <div>
                    <TextSpanBold>{t('i18nModal.i18nAccountInfo.delegated')}:</TextSpanBold>{' '}
                    {accountInfo.total_resources.cpu_weight || '--'}
                  </div>
                  <div>
                    <TextSpanBold>{t('i18nModal.i18nAccountInfo.current')}:</TextSpanBold>{' '}
                    {accountInfo.cpu_limit.used || '--'} /{' '}
                    <TextSpanBold>{t('i18nModal.i18nAccountInfo.available')}:</TextSpanBold>{' '}
                    {accountInfo.cpu_limit.available || '--'} {t('i18nModal.i18nAccountInfo.time')}
                  </div>
                  <div>
                    <TextSpanBold>{t('i18nModal.i18nAccountInfo.max')}:</TextSpanBold>{' '}
                    {accountInfo.cpu_limit.max || '--'} {t('i18nModal.i18nAccountInfo.time')}
                  </div>
                </DataBlock>
                {!!accountInfo.voter_info && (
                  <DataBlock>
                    <div>
                      <TextSpanBold>{t('i18nModal.i18nAccountInfo.voterInfo')}:</TextSpanBold>{' '}
                      {accountInfo.voter_info.owner || '--'}
                    </div>
                    <div>
                      <TextSpanBold>{t('i18nModal.i18nAccountInfo.proxy')}:</TextSpanBold>{' '}
                      {accountInfo.voter_info.proxy || '--'}
                    </div>
                    <div>
                      <TextSpanBold>{t('i18nModal.i18nAccountInfo.producers')}:</TextSpanBold>{' '}
                      {accountInfo.voter_info.producers.length || '--'}
                    </div>
                    <div>
                      <TextSpanBold>{t('i18nModal.i18nAccountInfo.stakedLB')}:</TextSpanBold>{' '}
                      {accountInfo.voter_info.staked || '--'}
                    </div>
                    <div>
                      <TextSpanBold>{t('i18nModal.i18nAccountInfo.lastVoteWeight')}:</TextSpanBold>{' '}
                      {accountInfo.voter_info.last_vote_weight || '--'}
                    </div>
                    <div>
                      <TextSpanBold>{t('i18nModal.i18nAccountInfo.proxieVoteWeight')}:</TextSpanBold>{' '}
                      {accountInfo.voter_info.proxied_vote_weight || '--'}
                    </div>
                    <div>
                      <TextSpanBold>{t('i18nModal.i18nAccountInfo.isProxy')}:</TextSpanBold>{' '}
                      {accountInfo.voter_info.is_proxy || 0}
                    </div>
                    <div>
                      <TextSpanBold>{t('i18nModal.i18nAccountInfo.deferredTrxId')}:</TextSpanBold>{' '}
                      {accountInfo.voter_info.deferred_trx_id || '--'}
                    </div>
                    <div>
                      <TextSpanBold>{t('i18nModal.i18nAccountInfo.lastUnstakeTime')}:</TextSpanBold>{' '}
                      {accountInfo.voter_info.last_unstake_time || '--'}
                    </div>
                    <div>
                      <TextSpanBold>{t('i18nModal.i18nAccountInfo.unstaking')}:</TextSpanBold>{' '}
                      {accountInfo.unstaking || '--'}
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
  t: PropTypes.func,
  modalDataFetchingState: PropTypes.bool,
  actions: PropTypes.object,
  accountInfo: PropTypes.object,
  accountName: PropTypes.string,
};
