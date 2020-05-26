'use strict';

import { handleActions } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_SLIDESHOW_ID] : (state, action) => ({
    ...state,
    slideshowId: action.payload
  }),

}, {
  slideshowId: null,
});
