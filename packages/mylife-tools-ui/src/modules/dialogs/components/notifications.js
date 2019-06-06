'use strict';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
//import { Portal } from 'react-portal';
import { makeStyles, colors, Snackbar, IconButton } from '@material-ui/core';
import * as icons from '@material-ui/icons';
import { getNotifications } from '../selectors';
import { notificationDismiss } from '../actions';

const typeIcons = {
  success: icons.CheckCircle,
  info: icons.Info,
  warning: icons.Warning,
  error: icons.Error
};

const { Close: CloseIcon } = icons;

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: colors.green[600],
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: colors.amber[700],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));


const Notification = ({ message, type, onCloseClick }) => {
  const classes = useStyles();
  const typeValue = type.description;
  const Icon = typeIcons[typeValue];
  return (
    <Snackbar
      open={true}
      onClose={onCloseClick}
      ContentProps={{
        'aria-describedby': 'message-id',
        className: classes[typeValue]
      }}
      message={
        <span id='message-id' className={classes.message}>
          <Icon className={classes.icon} />
          {message}
        </span>
      }
      action={[
        <IconButton key='close' aria-label='Fermer' color='inherit' onClick={onCloseClick}>
          <CloseIcon />
        </IconButton>
      ]}
    />
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  type: PropTypes.symbol.isRequired,
};

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      notifications: getNotifications(state)
    })),
    ...useMemo(() => ({
      dismiss : (id) => dispatch(notificationDismiss(id))
    }), [dispatch])
  };
};

const Notifications = () => {
  const { dismiss, notifications } = useConnect();
  return (
    <React.Fragment>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          onCloseClick={() => dismiss(notification.id)}
          {...notification}
        />
      ))}
    </React.Fragment>
  );
};

export default Notifications;
