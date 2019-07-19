'use strict';

import { createAction, io } from 'mylife-tools-ui';
import { actionTypes } from '../constants';

const local = {
  getOperations: createAction(actionTypes.REPORTING_GET_OPERATIONS)
};

export const refreshOperations = (minDate, maxDate, account) => {
  return async (dispatch) => {
    const query = formatOperationsQuery({ minDate, maxDate, account });

    const data = await dispatch(io.call({
      service: 'management',
      method: 'getOperations',
      ... query
    }));

    dispatch(local.getOperations(data));
  };
};

function formatOperationsQuery({ minDate, maxDate, account }) {
  const query = {};
  if(minDate) {
    query.minDate = minDate.valueOf();
  }
  if(maxDate) {
    query.maxDate = maxDate.valueOf();
  }
  if(account) {
    query.account = account;
  }
  return query;
}
