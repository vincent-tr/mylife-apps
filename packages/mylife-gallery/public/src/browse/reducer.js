'use strict';

import { handleActions, io } from 'mylife-tools-ui';
import actionTypes from './action-types';

const initialDisplay = {
  sortField: null,
  sortOrder: 'asc'
};

export default handleActions({

  [actionTypes.SET_VIEW] : (state, action) => ({
    ...state,
    viewId: action.payload
  }),

  [actionTypes.SET_DISPLAY] : (state, action) => ({
    ...state,
    display: action.payload || initialDisplay
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    viewId: null
  })

}, {
  viewId: null,
  display: initialDisplay
});
