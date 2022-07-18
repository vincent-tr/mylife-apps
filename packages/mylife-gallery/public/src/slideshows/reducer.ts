'use strict';

import { handleActions } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_SELECTED] : (state, action) => ({
    ...state,
    selectedId: action.payload,
  }),

}, {
  selectedId: null,
});
