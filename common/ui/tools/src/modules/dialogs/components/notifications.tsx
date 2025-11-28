import CheckCircle from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import Error from '@mui/icons-material/Error';
import Info from '@mui/icons-material/Info';
import Warning from '@mui/icons-material/Warning';
import IconButton from '@mui/material/IconButton';
import Portal from '@mui/material/Portal';
import SnackbarContent from '@mui/material/SnackbarContent';
import { styled } from '@mui/material/styles';
import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getNotifications, dismissNotification } from '../store';
import { NotificationType } from '../types';

const typeIcons = {
  success: CheckCircle,
  info: Info,
  warning: Warning,
  error: Error,
};

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    notifications: useSelector(getNotifications),
    ...useMemo(
      () => ({
        dismiss: (id: number) => dispatch(dismissNotification(id)),
      }),
      [dispatch]
    ),
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
  margin: 'auto',
});

interface NotificationProps {
  message: string;
  type: NotificationType;
  onCloseClick: () => void;
}

function Notification({ message, type, onCloseClick }: NotificationProps) {
  const Icon = typeIcons[type];
  return (
    <Content
      aria-describedby="message-id"
      className={type}
      message={
        <Message id="message-id">
          <StyledIcon as={Icon} />
          {message}
        </Message>
      }
      action={[
        <IconButton key="close" aria-label="Fermer" color="inherit" onClick={onCloseClick}>
          <CloseIcon />
        </IconButton>,
      ]}
    />
  );
}

export default function Notifications() {
  const { dismiss, notifications } = useConnect();
  return (
    <Portal key="notificationsPortal">
      <Overlay>
        {notifications.map((notification) => (
          <Notification key={notification.id} onCloseClick={() => dismiss(notification.id)} {...notification} />
        ))}
      </Overlay>
    </Portal>
  );
}
