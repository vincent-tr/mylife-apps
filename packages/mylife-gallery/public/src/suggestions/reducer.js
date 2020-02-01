'use strict';

import { handleActions, io } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_VIEW] : (state, action) => ({
    ...state,
    viewId: action.payload
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    viewId: null
  }),

  [actionTypes.SET_DIALOG_OBJECTS] : (state, action) => ({
    ...state,
    dialogObjects: action.payload
  }),

}, {
  viewId: null,
  dialogObjects: null
});
