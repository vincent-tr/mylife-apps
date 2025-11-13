// see : https://github.com/supasate/connected-react-router/blob/master/src/actions.js

import { createAction } from '@reduxjs/toolkit';
import actionTypes, { CallPayload, SetOnlinePayload, ViewChangePayload, ViewClosePayload } from './action-types';

export const setOnline = createAction<SetOnlinePayload>(actionTypes.SET_ONLINE);

export const viewChange = createAction<ViewChangePayload>(actionTypes.VIEW_CHANGE);
const viewClose = createAction<ViewClosePayload>(actionTypes.VIEW_CLOSE);

export const call = createAction<CallPayload>(actionTypes.CALL);

export const unnotify = (viewId, service = 'common') => async dispatch => {

  await dispatch(call({
    service,
    method: 'unnotify',
    viewId
  }));

  dispatch(viewClose({ viewId }));
};
