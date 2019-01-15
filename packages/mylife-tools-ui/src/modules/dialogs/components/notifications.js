'use strict';

import React from 'react';
import {Portal} from 'react-portal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getNotifications } from '../selectors';
import { notificationDismiss } from '../actions';
import { Button } from '../../../components';

const NOTIFICATION_CONTAINER_STYLE = {
  position  : 'fixed',
  top       : '10px',
  right     : 0,
  left      : 0,
  zIndex   : 1000,
  width     : '80%',
  maxWidth : '400px',
  margin    : 'auto',
};

const Notification = ({ message, header, type, onCloseClick }) => {
  let headerText = header;
  let messageText = message;

  if(!headerText) {
    headerText = message;
    messageText = null;
  }

  const messageHeader = headerText ? <div className='header'>{headerText}</div> : null;

  // Turn the type string into a boolean prop with the same name
  // TODO: type

  if(typeof messageText === 'string') {
    const messagePieces = messageText.split('\n');
    messageText = messagePieces.map((piece, index) => (<div key={index}>{piece}</div>));
  }

  return (
    <div className='dialog-notification'>
      <Button onClick={onCloseClick}>X</Button>
      {messageHeader}
      <div className='content'>{messageText}</div>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  header: PropTypes.string,
  type: PropTypes.symbol.isRequired,
};

const Notifications = ({ dismiss, notifications }) => (
  <Portal isOpened={true} key="notificationsPortal">
    <div style={NOTIFICATION_CONTAINER_STYLE}>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          onCloseClick={() => dismiss(notification.id)}
          {...notification}
        />
      ))}
    </div>
  </Portal>
);

Notifications.propTypes = {
  dismiss: PropTypes.func.isRequired,
  notifications: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  notifications : getNotifications(state),
});

const mapDispatchToProps = (dispatch) => ({
  dismiss : (id) => dispatch(notificationDismiss(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
