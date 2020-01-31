'use strict';

import { handleActions, io } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_SELECTOR_VIEW] : (state, action) => ({
    ...state,
    selectorViewId: action.payload
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    selectorViewId: null
  })

}, {
  selectorViewId: null,
});
