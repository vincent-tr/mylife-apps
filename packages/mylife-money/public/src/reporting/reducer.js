'use strict';

import { handleActions, io } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_VIEW] : (state, action) => ({
    ...state,
    view: action.payload
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    view: null
  })

}, {
  view: null,
});
