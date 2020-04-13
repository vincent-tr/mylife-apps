'use strict';

import { io, handleActions } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_VIEW] : (state, action) => ({
    ...state,
    viewId: action.payload
  }),

  [actionTypes.REF] : (state) => ({
    ...state,
    refCount: state.refCount + 1
  }),

  [actionTypes.UNREF] : (state) => ({
    ...state,
    refCount: Math.max(state.refCount - 1, 0)
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    viewId: null,
    refCount: 0
  })

}, {
  viewId: null,
  refCount: 0
});
