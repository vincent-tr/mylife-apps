import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Portal, SnackbarContent, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
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

const Content = styled(SnackbarContent)(({ theme }) => ({
  marginBottom: '0.2rem',
  '&.success': {
    backgroundColor: theme.palette.success.main,
  },
  '&.info': {
    backgroundColor: theme.palette.info.main,
  },
  '&.warning': {
    backgroundColor: theme.palette.warning.main,
  },
  '&.error': {
    backgroundColor: theme.palette.error.main,
  },
}));

const StyledIcon = styled('svg')(({ theme }) => ({
  fontSize: 20,
  opacity: 0.9,
  marginRight: theme.spacing(1),
}));

const Message = styled('span')({
  display: 'flex',
  alignItems: 'center',
});

const Overlay = styled('div')({
  position: 'fixed',
  top: '1rem',
  right: 0,
  left: 0,
  zIndex: 1000,
  width: '80%',
  maxWidth: '20rem',
  margin: 'auto'
});

const Notification = ({ message, type, onCloseClick }) => {
  const typeValue = type.description;
  const Icon = typeIcons[typeValue];
  return (
    <Content
      aria-describedby='message-id'
      className={typeValue}
      message={
        <Message id='message-id'>
          <StyledIcon as={Icon} />
          {message}
        </Message>
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
  const { dismiss, notifications } = useConnect();
  return (
    <Portal key='notificationsPortal'>
      <Overlay>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            onCloseClick={() => dismiss(notification.id)}
            {...notification}
          />
        ))}
      </Overlay>
    </Portal>
  );
};

export default Notifications;
