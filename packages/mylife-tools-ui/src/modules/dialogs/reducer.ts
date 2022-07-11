'use strict';

import immutable         from 'immutable';
import { handleActions } from 'redux-actions';
import actionTypes       from './action-types';

type FIXME_any = any;

const defaultState = {
  busy          : false,
  error         : null,
  notifications : immutable.List<FIXME_any>()
};

const others = handleActions({

  [actionTypes.BUSY_SET] : (state, action: FIXME_any) => ({
    ...state,
    busy : action.payload
  }),

  [actionTypes.ERROR_CLEAR] : state => ({
    ...state,
    error : null
  }),

  //https://gist.github.com/markerikson/7621fca0e9704e99db5598bed0db861d
  [actionTypes.NOTIFICATION_SHOW] : (state, action: FIXME_any) => ({
    ...state,
    notifications : state.notifications.unshift(action.payload)
  }),

  [actionTypes.NOTIFICATION_DISMISS] : (state, action: FIXME_any) => ({
    ...state,
    notifications : state.notifications.filter(n => n.id !== action.payload)
  }),

  [actionTypes.NOTIFICATION_CLEAR] : state => ({
    ...state,
    notifications : state.notifications.clear()
  }),

}, defaultState);

export default function(state = defaultState, action) {
  if(action.error) {
    return { ... state, error : action.payload };
  }

  return others(state, action);
}
