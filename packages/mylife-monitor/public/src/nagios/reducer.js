'use strict';

import { handleActions, io } from 'mylife-tools-ui';
import actionTypes from './action-types';

const initialCriteria = {
  onlyProblems: false
};

export default handleActions({

  [actionTypes.SET_CRITERIA] : (state, action) => ({
    ...state,
    criteria: action.payload || initialCriteria
  }),

  [actionTypes.SET_VIEW] : (state, action) => ({
    ...state,
    viewId: action.payload
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    viewId: null
  })

}, {
  viewId: null,
  criteria: initialCriteria,
});
