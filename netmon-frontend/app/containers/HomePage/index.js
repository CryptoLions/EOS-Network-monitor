// Core
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Components
import Modal from '../../components/Modal';
import NavigationMenu from './NavigationMenu';
import FirstSection from './FirstSection';
import SecondSection from './SecondSection';

// Actions
import { uiActions } from '../../bus/ui/actions';

// Selectors
import { selectModal } from '../../bus/ui/selectors';

// Image
import lion from '../../assets/images/lion.png';

// Styles
import { MainContainer, Footer, Lion, FooterSpan } from './styles';

const mapStateToProps = createStructuredSelector({
  // modal
  modal: selectModal(),
});

const mapDispatchToProps = dispach => ({
  actions: bindActionCreators(
    {
      toggleModal: uiActions.toggleModal,
    },
    dispach
  ),
});

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class HomePage extends PureComponent {
  componentDidMount() {
    const hash = window.location.hash.split(/:/g);
    if (hash.length === 2) this.props.actions.toggleModal(hash[0].replace('#', ''), hash[1]);
  }

  render() {
    const {
      modal,
      actions: { toggleModal },
    } = this.props;

    return (
      <Fragment>
        {modal && modal.type && <Modal toggleModal={toggleModal} modal={modal} />}
        <NavigationMenu toggleModal={toggleModal} />
        <MainContainer>
          <FirstSection />
          <SecondSection />
        </MainContainer>
        <Footer>
          <FooterSpan>
            <Lion src={lion} alt="Lion" /> 2018 Created by CryptoLions.io (GitHub v2.0.{process.env.VERSION_NUMBER})
          </FooterSpan>
        </Footer>
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  modal: PropTypes.object,
  actions: PropTypes.object,
};
