'use strict';

import { handleActions, io, routing } from 'mylife-tools-ui';
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

  [actionTypes.SHOW_DETAIL] : (state, action) => ({
    ...state,
    showDetail: action.payload
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    albumViewId: null,
    documentViewId: null
  }),

  [routing.actionTypes.LOCATION_CHANGE] : (state) => ({
    ...state,
    showDetail: true
  }),

}, {
  albumId: null,
  albumViewId: null,
  documentViewId: null,
  showDetail: true
});
