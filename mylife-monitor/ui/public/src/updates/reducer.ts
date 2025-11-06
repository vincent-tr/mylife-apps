'use strict';

import { handleActions } from 'redux-actions';

import actionTypes from './action-types';

const initialCriteria = {
  onlyProblems: true
};

export default handleActions({

  [actionTypes.SET_CRITERIA] : (state, action) => ({
    ...state,
    criteria: action.payload || initialCriteria
  }),

}, {
  criteria: initialCriteria,
});
