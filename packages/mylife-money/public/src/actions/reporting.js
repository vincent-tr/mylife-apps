'use strict';

import { createAction, io } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { getOperationStatsViewId } from '../selectors/reporting';

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

const getOperationStats = () => async (dispatch) => {
  const viewId = await dispatch(io.call({
    service: 'reporting',
    method: 'notifyOperationStats',
  }));

  dispatch(local.setOperationStatsView(viewId));
};

const clearOperationStats = () => async (dispatch, getState) => {
  const state = getState();
  const viewId = getOperationStatsViewId(state);
  if(!viewId) {
    return;
  }

  await dispatch(io.unnotify(viewId));
  dispatch(local.setOperationStatsView(null));
};

export const homeEnter = () => async (dispatch) => {
  await dispatch(getOperationStats());
};

export const homeLeave = () => async (dispatch) => {
  await dispatch(clearOperationStats());
};
