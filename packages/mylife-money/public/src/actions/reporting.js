'use strict';

import { createAction } from 'mylife-tools-ui';
import { actionTypes } from '../constants';

const queryOperations = createAction(actionTypes.REPORTING_QUERY_OPERATIONS);

export const refreshOperations = (minDate, maxDate, account) => {
  return queryOperations({ minDate, maxDate, account });
};
