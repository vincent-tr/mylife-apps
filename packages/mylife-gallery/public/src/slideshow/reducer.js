'use strict';

import { handleActions, io } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_SLIDESHOW_ID] : (state, action) => ({
    ...state,
    slideshowId: action.payload
  }),

  [actionTypes.SET_SLIDESHOW_VIEW] : (state, action) => ({
    ...state,
    slideshowViewId: action.payload
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    slideshowViewId: null
  })

}, {
  slideshowId: null,
  slideshowViewId: null,
});
