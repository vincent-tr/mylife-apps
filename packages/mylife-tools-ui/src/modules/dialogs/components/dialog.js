'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import StoreProvider from '../../../components/application/store-provider';

import './dialog.scss';

const Dialog = ({ open, onClose, children }) => (
  // http://reactcommunity.org/react-modal/#usage
  <Modal
    className='dialog'
    overlayClassName='dialog-overlay'
    isOpen={open}
    onRequestClose={onClose}
    shouldCloseOnOverlayClick={false}>
    <StoreProvider>
      {children}
    </StoreProvider>
  </Modal>
);

Dialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

export default Dialog;
