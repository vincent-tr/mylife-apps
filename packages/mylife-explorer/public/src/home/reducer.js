'use strict';

import { handleActions } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_DATA] : (state, action) => ({
    ...state,
    data: action.payload
  }),

  [actionTypes.SET_DETAIL] : (state, action) => ({
    ...state,
    detail: action.payload
  }),


}, {
  data: null,
  detail: false
});
