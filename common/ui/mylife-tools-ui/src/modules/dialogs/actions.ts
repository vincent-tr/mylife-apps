import { createAction } from '@reduxjs/toolkit';
import actionTypes, { BusyPayload, ErrorPayload, NotificationDismissPayload, NotificationPayload } from './action-types';
import notificationTypes from './notification-types';

export const busySet = createAction<BusyPayload>(actionTypes.BUSY_SET);
export const errorClear = createAction<ErrorPayload>(actionTypes.ERROR_CLEAR);

export const notificationDismiss = createAction<NotificationDismissPayload>(actionTypes.NOTIFICATION_DISMISS);
export const notificationClearAll = createAction(actionTypes.NOTIFICATION_CLEAR);
const notificationShowInternal = createAction<NotificationPayload>(actionTypes.NOTIFICATION_SHOW);

// https://gist.github.com/markerikson/7621fca0e9704e99db5598bed0db861d
let notificationIdGenerator = 0;
export const notificationShow = ({ message = '', type = notificationTypes.info, id = ++notificationIdGenerator, dismissAfter = 5000 } = {}) => dispatch => {
  dispatch(notificationShowInternal({ message, type, id }));

  if(Number.isInteger(dismissAfter)) {
    setTimeout(() => dispatch(notificationDismiss(id)), dismissAfter);
  }
};

notificationShow.types = notificationTypes;
