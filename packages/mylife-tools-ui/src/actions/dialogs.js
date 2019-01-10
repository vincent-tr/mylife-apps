'use strict';

import { createAction }   from 'redux-actions';
import actionTypes        from '../constants/internal/action-types';
import notificationTypes  from '../constants/internal/notification-types';

export const errorClear = createAction(actionTypes.ERROR_CLEAR);
export const infoClear = createAction(actionTypes.INFO_CLEAR);
export const infoShow = createAction(actionTypes.INFO_SHOW);

export const notificationDismiss = createAction(actionTypes.MESSAGE_DISMISS);
export const notificationClearAll = createAction(actionTypes.MESSAGE_CLEAR);
const notificationShowInternal = createAction(actionTypes.MESSAGE_SHOW);

// https://gist.github.com/markerikson/7621fca0e9704e99db5598bed0db861d
let notificationIdGenerator = 0;
export const notificationShow = ({ message = '', header = '', type = notificationTypes.info, id = ++notificationIdGenerator, dismissAfter = 5000 } = {}) => dispatch => {
  dispatch(notificationShowInternal({ message, header, type, id }));

  if(Number.isInteger(dismissAfter)) {
    setTimeout(() => dispatch(notificationDismiss(id)), dismissAfter);
  }
};

notificationShow.types = notificationTypes;
