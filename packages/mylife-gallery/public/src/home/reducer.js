'use strict';

import { handleActions } from 'mylife-tools-ui';
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

  [actionTypes.SET_DISPLAY] : (state, action) => ({
    ...state,
    display: action.payload || initialDisplay
  }),

  [actionTypes.SET_CRITERIA] : (state, action) => ({
    ...state,
    criteria: action.payload || initialCriteria
  }),

}, {
  criteria: initialCriteria,
  display: initialDisplay
});
