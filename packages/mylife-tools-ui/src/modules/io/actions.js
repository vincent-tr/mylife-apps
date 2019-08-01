'use strict';

// see : https://github.com/supasate/connected-react-router/blob/master/src/actions.js

import { createAction } from 'redux-actions';
import actionTypes from './action-types';

export const setOnline = createAction(actionTypes.SET_ONLINE);

export const viewChange = createAction(actionTypes.VIEW_CHANGE);
const viewClose = createAction(actionTypes.VIEW_CLOSE);

export const call = createAction(actionTypes.CALL);

export const unnotify = (viewId, service = 'common') => async dispatch => {

  await dispatch(call({
    service,
    method: 'unnotify',
    viewId
  }));

  dispatch(viewClose({ viewId }));
};
