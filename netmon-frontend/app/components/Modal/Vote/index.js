// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import eos from 'eosjs';
import store from 'store';

// Selectors & Utils
import { selectCheckedProducers } from '../../../bus/producers/selectors';

// Styles
import { Header, HeadBox, HeadText, Link } from '../styles';
import {
  MainContainer,
  TextSpan,
  Container,
  Input,
  InstallLink,
  ScatterLink,
  FooterText,
  Bold,
  ScatterError,
  ScatterSuccess,
  Footer,
} from './styles';

const mapStateToProps = createStructuredSelector({
  selectedProducers: selectCheckedProducers(),
});

const EOSnetwork = {
  name: 'EOS Main Net',
  host: 'bp.cryptolions.io',
  port: 8888,
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  secured: false,
};

@connect(mapStateToProps)
export default class Vote extends PureComponent {
  state = {
    scatterInited: false,
    votingSuccess: false,
    accountName: store.get('modal_vote') || 'cryptolions1',
    error: undefined,
  };

  onAccountNameChange = e => this.setState({ accountName: e.target.value });

  initScatter = async () => {
    const { accountName } = this.state;

    this.setState({ votingSuccess: false, error: undefined });
    store.set('modal_vote', accountName);

    try {
      await window.scatter.suggestNetwork({
        blockchain: 'eos',
        host: EOSnetwork.host,
        port: EOSnetwork.scatterPort || EOSnetwork.port,
        chainId: EOSnetwork.chainId,
        httpEndpoint: `http://${EOSnetwork.host}:${EOSnetwork.port}`,
        expireInSeconds: 120,
      });

      const requiredFields = { accounts: [{ blockchain: 'eos', chainId: EOSnetwork.chainId }] };

      await window.scatter.getIdentity(requiredFields);

      this.setState({ error: undefined, scatterInited: true });
    } catch (error) {
      this.setState({ error });
      console.error(error);
    }
  };

  voteScatter = async () => {
    const { accountName } = this.state;
    const { selectedProducers } = this.props;

    this.setState({ votingSuccess: false, error: undefined });

    const entity = window.scatter.eos(
      {
        blockchain: 'eos',
        host: EOSnetwork.host,
        port: EOSnetwork.port,
        chainId: EOSnetwork.chainId,
        expireInSeconds: 120,
      },
      eos,
      { chainId: EOSnetwork.chainId }
    );

    try {
      await entity.transaction(tr => tr.voteproducer(accountName, '', selectedProducers));

      this.setState({ votingSuccess: true });
    } catch (error) {
      this.setState({ error });
      console.error(error);
    }
  };

  renderMessage = () => {
    const { error, votingSuccess } = this.state;

    if (error) {
      let errorMesage;
      if (error.type === 'account_missing' && error.code === 402) {
        errorMesage = 'Missing required accounts, repull the identity. Choose account the same as added in Scatter.';
      }

      if (error.type === 'identity_rejected' && error.code === 402) {
        errorMesage = 'Please accept Identity request';
      }

      if (error.type === 'locked' && error.code === 423) {
        errorMesage = 'Your Scatter wallet is locked';
      }

      if (error.type === 'signature_rejected' && error.code === 402) {
        errorMesage = 'Voting Transaction canceled (you rejected signature request)';
      }

      if (!errorMesage) {
        return undefined;
      }

      return <ScatterError>{errorMesage}</ScatterError>;
    }

    if (votingSuccess) {
      return <ScatterSuccess>Thank you for Voting</ScatterSuccess>;
    }

    return undefined;
  };

  render() {
    const { accountName, scatterInited } = this.state;
    const { selectedProducers } = this.props;

    return (
      <Fragment>
        <Header>
          <HeadBox>
            <HeadText>VOTE</HeadText>
          </HeadBox>
        </Header>
        <MainContainer>
          <TextSpan>
            By proceeding you agree to abide by the{' '}
            <Link href="#" target="_blank">
              EOS Constitution
            </Link>.
          </TextSpan>
          <TextSpan>
            This feature was created to help with voting. It creates a cleos command based on checked producers, and
            uses{' '}
            <Link href="https://github.com/CryptoLions/EOS-MainNet/blob/master/cleos.sh" target="_blank">
              cleos.sh
            </Link>, our cleos wrapper (which just configures ports and addresses).
          </TextSpan>
          <TextSpan>
            <Bold>{`Selected producers: ${selectedProducers.join(', ')}`}</Bold>
          </TextSpan>
          {this.renderMessage()}
          <Container>
            <Input value={accountName} placeholder="Your account name..." onChange={this.onAccountNameChange} />
            {!window.scatter && (
              <InstallLink href="https://get-scatter.com/" target="_blank">
                Install Scatter
              </InstallLink>
            )}
            {!!window.scatter && !!scatterInited && <ScatterLink onClick={this.voteScatter}>Vote</ScatterLink>}
            {!!window.scatter && !scatterInited && <ScatterLink onClick={this.initScatter}>Init Scatter</ScatterLink>}
          </Container>
          <Footer>
            {selectedProducers.length !== 0 ? (
              <FooterText>
                ./cleos.sh system voteproducer prods {accountName} {selectedProducers.join(' ')} -p {accountName}
              </FooterText>
            ) : (
              <FooterText>Check at least one producer (check box)</FooterText>
            )}
          </Footer>
        </MainContainer>
      </Fragment>
    );
  }
}

Vote.propTypes = {
  selectedProducers: PropTypes.array,
};
