'use strict';

import { createAction, io } from 'mylife-tools-ui';
import { actionTypes } from '../constants';

const local = {
  getOperations: createAction(actionTypes.REPORTING_GET_OPERATIONS),
  setOperationStatsView: createAction(actionTypes.REPORTING_SET_OPERATION_STATS_VIEW),
};

export const refreshOperations = (minDate, maxDate, account) => {
  return async (dispatch) => {
    const query = { minDate, maxDate, account };

    const data = await dispatch(io.call({
      service: 'reporting',
      method: 'getOperations',
      ... query
    }));

    dispatch(local.getOperations(data));
  };
};

export const getOperationStats = () => async (dispatch) => {
  const viewId = await dispatch(io.call({
    service: 'reporting',
    method: 'notifyOperationStats',
  }));

  dispatch(local.setOperationStatsView(viewId));
};
