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

  [actionTypes.SET_CLEAN_DOCUMENTS] : (state, action) => ({
    ...state,
    cleanDocuments: action.payload
  }),

}, {
  viewId: null,
  cleanDocuments: null
});
