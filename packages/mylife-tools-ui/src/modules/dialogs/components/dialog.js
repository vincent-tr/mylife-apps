'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import StoreProvider from '../../../components/application/store-provider';

import './dialog.scss';

// TODO: handle keys ([Y]es, Enter, ...)

const Dialog = ({ open, onClose, title, actions, children, ...props }) => (
  // http://reactcommunity.org/react-modal/#usage
  <Modal
    className='dialog'
    overlayClassName='dialog-overlay'
    isOpen={open}
    onRequestClose={onClose}
    shouldCloseOnOverlayClick={false}
    {...props}>
    <StoreProvider>
      <React.Fragment>
        {title && (
          <div className='title'>
            {title}
          </div>
        )}
        <div className='content'>
          {children}
        </div>
        {actions && (
          <div className='actions'>
            {actions}
          </div>
        )}
      </React.Fragment>
    </StoreProvider>
  </Modal>
);

Dialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  title: PropTypes.node,
  actions: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

export default Dialog;
