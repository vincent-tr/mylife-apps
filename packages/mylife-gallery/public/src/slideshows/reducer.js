'use strict';

import { handleActions, io } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_VIEW] : (state, action) => ({
    ...state,
    viewId: action.payload,
    selectedId: null,
  }),

  [actionTypes.SET_SELECTED] : (state, action) => ({
    ...state,
    selectedId: action.payload,
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    viewId: null,
    selectedId: null,
  })

}, {
  viewId: null,
  selectedId: null,
});
