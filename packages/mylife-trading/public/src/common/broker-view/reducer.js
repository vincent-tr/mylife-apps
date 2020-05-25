'use strict';

import { io, handleActions } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.REF] : (state) => ({
    ...state,
    refCount: state.refCount + 1
  }),

  [actionTypes.UNREF] : (state) => ({
    ...state,
    refCount: Math.max(state.refCount - 1, 0)
  }),

}, {
  refCount: 0
});
