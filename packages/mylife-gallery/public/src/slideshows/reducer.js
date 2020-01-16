'use strict';

import { handleActions, io } from 'mylife-tools-ui';
import actionTypes from './action-types';

const initialCriteria = {
  title: null,
  keywords: null,
};

const initialDisplay = {
  sortField: 'title',
  sortOrder: 'desc'
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

  [actionTypes.SET_CRITERIA] : (state, action) => ({
    ...state,
    criteria: action.payload || initialCriteria
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    viewId: null
  })

}, {
  viewId: null,
  criteria: initialCriteria,
  display: initialDisplay
});
