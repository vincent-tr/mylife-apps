'use strict';

import { handleActions, io } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_DOCUMENT_VIEW] : (state, action) => ({
    ...state,
    documentViewId: action.payload
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    documentViewId: null,
    keywordsViewId: null
  })

}, {
  documentViewId: null
});
