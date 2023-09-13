'use strict';

import { handleActions } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_DIALOG_OBJECTS] : (state, action) => ({
    ...state,
    dialogObjects: action.payload
  }),

}, {
  viewId: null,
  dialogObjects: null
});
