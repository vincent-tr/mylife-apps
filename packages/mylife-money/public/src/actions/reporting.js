'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';

const queryOperations = createAction(actionTypes.REPORTING_QUERY_OPERATIONS);

export const refreshOperations = (minDate, maxDate, account) => {
  return queryOperations({ minDate, maxDate, account });
};

export const resetOperations = createAction(actionTypes.REPORTING_RESET_OPERATIONS);
