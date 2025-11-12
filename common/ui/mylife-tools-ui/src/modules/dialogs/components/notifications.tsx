import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles, Portal, SnackbarContent, IconButton } from '@mui/material';
import * as icons from '@mui/icons-material';
import { getNotifications } from '../selectors';
import { notificationDismiss } from '../actions';

const typeIcons = {
  success: icons.CheckCircle,
  info: icons.Info,
  warning: icons.Warning,
  error: icons.Error
};

const { Close: CloseIcon } = icons;

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

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: theme.palette.success.main,
  },
  info: {
    backgroundColor: theme.palette.info.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  box: {
    marginBottom: '0.2rem'
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
  overlay: {
    position  : 'fixed',
    top       : '1rem',
    right     : 0,
    left      : 0,
    zIndex    : 1000,
    width     : '80%',
    maxWidth  : '20rem',
    margin    : 'auto'
  }
}));

const Notification = ({ message, type, onCloseClick }) => {
  const classes = useStyles();
  const typeValue = type.description;
  const Icon = typeIcons[typeValue];
  return (
    <SnackbarContent
      aria-describedby='message-id'
      className={clsx(classes.box, classes[typeValue])}
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

const Notifications = () => {
  const classes = useStyles();
  const { dismiss, notifications } = useConnect();
  return (
    <Portal key='notificationsPortal'>
      <div className={classes.overlay}>
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
