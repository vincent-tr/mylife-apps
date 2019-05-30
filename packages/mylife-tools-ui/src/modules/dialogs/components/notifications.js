'use strict';

import React from 'react';
import { Portal } from 'react-portal';
import PropTypes from 'prop-types';
import { getNotifications } from '../selectors';
import { notificationDismiss } from '../actions';
import { Button } from '../../../components';
import { createUseConnect } from 'react-use-redux';

const Notification = ({ message, header, type, onCloseClick }) => {

  if(typeof message === 'string') {
    const messagePieces = message.split('\n');
    message = messagePieces.map((piece, index) => (<div key={index}>{piece}</div>));
  }

  if(typeof header === 'string') {
    header = (<h3>{header}</h3>);
  }

  return (
    <div className={`notification ${type.description}`}>
      <div className='action'>
        <Button onClick={onCloseClick}>X</Button>
      </div>
      {header && <div className='title'>{header}</div>}
      <div className='content'>{message}</div>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  header: PropTypes.string,
  type: PropTypes.symbol.isRequired,
};

const useConnect = createUseConnect(
  (state) => ({
    notifications : getNotifications(state),
  }),
  (dispatch) => ({
    dismiss : (id) => dispatch(notificationDismiss(id))
  })
);

const Notifications = () => {
  const { dismiss, notifications } = useConnect();
  return (
    <Portal isOpened={true} key='notificationsPortal'>
      <div className='notifications-overlay'>
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
};

export default Notifications;
