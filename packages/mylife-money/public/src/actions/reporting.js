'use strict';

import { createAction, io } from 'mylife-tools-ui';
import { actionTypes } from '../constants';

const local = {
  getOperations: createAction(actionTypes.REPORTING_GET_OPERATIONS)
};

export const refreshOperations = (minDate, maxDate, account) => {
  return async (dispatch) => {
    const query = { minDate, maxDate, account };

    const data = await dispatch(io.call({
      service: 'management',
      method: 'getOperations',
      ... query
    }));

    dispatch(local.getOperations(data));
  };
};
