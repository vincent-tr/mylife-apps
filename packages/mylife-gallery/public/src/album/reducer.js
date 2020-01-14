'use strict';

import { handleActions, io } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_ALBUM_ID] : (state, action) => ({
    ...state,
    albumId: action.payload
  }),

  [actionTypes.SET_ALBUM_VIEW] : (state, action) => ({
    ...state,
    albumViewId: action.payload
  }),

  [actionTypes.SET_DOCUMENT_VIEW] : (state, action) => ({
    ...state,
    documentViewId: action.payload
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    albumViewId: null,
    documentViewId: null
  })

}, {
  albumId: null,
  albumViewId: null,
  documentViewId: null,
});
