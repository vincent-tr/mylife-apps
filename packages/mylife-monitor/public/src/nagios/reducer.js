'use strict';

import { handleActions } from 'mylife-tools-ui';
import actionTypes from './action-types';

const initialCriteria = {
  onlyProblems: false
};

export default handleActions({

  [actionTypes.SET_CRITERIA] : (state, action) => ({
    ...state,
    criteria: action.payload || initialCriteria
  }),

}, {
  criteria: initialCriteria,
});
