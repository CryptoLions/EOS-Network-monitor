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
import { selectAccountHistory } from '../../../bus/modal/selectors';
import { selectModalDataFetchingState } from '../../../bus/ui/selectors';

// Utils
import { convertUtcToLocal } from '../../../utils/dateUtils';
import { stripHtml } from '../../../utils/stringUtils';
import { stringHandler } from '../../../utils/stringHandler';

// Styles
import {
  InputsDiv,
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
} from '../styles';
import { PaginationButton, PaginationWrapper, TransactionBlock, PageInput, InputButton, PageInputsDiv } from './styles';

const mapStateToProps = createStructuredSelector({
  modalDataFetchingState: selectModalDataFetchingState(),
  accountHistory: selectAccountHistory(),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      fetchAccountHistory: modalActions.fetchAccountHistory,
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
export default class AccountHistory extends PureComponent {
  state = {
    producerName: this.props.accountName || store.get('modal_accountHistory') || 'eoshuobipool',
    page: 0,
  };

  componentDidMount() {
    window.location.hash = `accountHistory:${this.state.producerName}`;
    this.getData();
  }

  componentWillUnmount() {
    window.location.hash = ``;
  }

  onAccountNameChange = e => this.setState({ producerName: e.target.value });

  onPageChange = e => {
    if (e.target.value > 0) {
      this.setState({ page: e.target.value - 1 });
    }
  };

  getData = () => {
    const { producerName, page } = this.state;
    const { modalDataFetchingState, actions } = this.props;
    if (producerName) {
      if (!modalDataFetchingState) actions.fetchAccountHistory(producerName, page);
      store.set('modal_accountHistory', producerName);
    }
  };

  changePage = step => () => this.setState(({ page }) => ({ page: page + step }), () => this.getData());

  toggleAccountInfoModal = e => this.props.actions.toggleModal('accountInfo', e.target.textContent);

  render() {
    const { producerName, page } = this.state;
    const {
      t,
      modalDataFetchingState,
      accountHistory,
      actions: { toggleModal },
    } = this.props;

    return (
      <Fragment>
        <Header>
          <HeadBox>
            <HeadText>{t('i18nModal.i18nAccountHistory.title')}</HeadText>
          </HeadBox>
          <HeadContainer>
            <InputsDiv>
              <Input
                value={producerName}
                placeholder={t('i18nModal.i18nAccountHistory.placeholder')}
                onChange={this.onAccountNameChange}
              />
              <GetButton onClick={this.getData}>{t('i18nModal.i18nAccountHistory.getButton')}</GetButton>
            </InputsDiv>
            <span>
              {t('i18nModal.i18nAccountHistory.GetInformationAboutAccountAndBalance')}.{' '}
              <Link onClick={() => toggleModal('accountInfo', producerName)}>
                {t('i18nModal.i18nAccountHistory.accountInfoLink')}
              </Link>
            </span>
          </HeadContainer>
        </Header>
        <LoadingLine state={modalDataFetchingState} />
        <Main>
          <PaginationWrapper>
            <PaginationButton
              onClick={this.changePage(-1)}
              disabled={!producerName || modalDataFetchingState || page === 0}
            >
              {t('i18nModal.i18nAccountHistory.prev')}
            </PaginationButton>
            <PageInputsDiv>
              {t('i18nModal.i18nAccountHistory.page')}:{' '}
              <PageInput type="number" value={page + 1} onChange={this.onPageChange} />
              <InputButton onClick={this.getData}>{t('i18nModal.i18nAccountHistory.getButton')}</InputButton>
            </PageInputsDiv>
            <PaginationButton onClick={this.changePage(1)} disabled={!producerName || modalDataFetchingState}>
              {t('i18nModal.i18nAccountHistory.next')}
            </PaginationButton>
          </PaginationWrapper>

          {!modalDataFetchingState &&
            !!accountHistory.length &&
            accountHistory.map((item, i) => (
              <TransactionBlock key={`accountHistory-${i}`}>
                <div>
                  <TextSpanBold>{t('i18nModal.i18nAccountHistory.block')}:</TextSpanBold>
                  <Link onClick={() => toggleModal('blockInfo', item.msgObject.c1)}>{`#${item.msgObject.c1}`}</Link>
                </div>
                <div>
                  <TextSpanBold>{t('i18nModal.i18nAccountHistory.txId')}:</TextSpanBold>
                  <Link onClick={() => toggleModal('transactions', item.txid)}>{item.txid}</Link>
                </div>
                <div>
                  <TextSpanBold>{t('i18nModal.i18nAccountHistory.date')}:</TextSpanBold>
                  <TextSpan>{convertUtcToLocal(item.date)}</TextSpan>
                </div>
                <div>
                  <TextSpanBold>{t('i18nModal.i18nAccountHistory.action')}:</TextSpanBold>
                  <TextSpan>{stripHtml(item.msgObject.c2)}</TextSpan>
                </div>
                <div>
                  <TextSpanBold>{t('i18nModal.i18nAccountHistory.from')}:</TextSpanBold>
                  <Link onClick={() => toggleModal('accountInfo', stripHtml(item.msgObject.c3))}>
                    {stripHtml(item.msgObject.c3)}
                  </Link>
                </div>
                <div>
                  <TextSpanBold>{t('i18nModal.i18nAccountHistory.info')}:</TextSpanBold>
                  {item.msgObject.c4 !== '->' &&
                    item.msgObject.c4 !== '>' &&
                    stringHandler(stripHtml(item.msgObject.c4), this.toggleAccountInfoModal)}
                  <br />
                  <TextSpan>
                    {item.msgObject.c5 !== '->' && item.msgObject.c5 !== '>' && stripHtml(item.msgObject.c5)}
                  </TextSpan>
                  <br />
                  <TextSpan>{item.msgObject.c6}</TextSpan>
                </div>
              </TransactionBlock>
            ))}
        </Main>
      </Fragment>
    );
  }
}

AccountHistory.propTypes = {
  t: PropTypes.func,
  modalDataFetchingState: PropTypes.bool,
  accountName: PropTypes.string,
  actions: PropTypes.object,
  accountHistory: PropTypes.object,
};
