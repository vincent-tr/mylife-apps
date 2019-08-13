'use strict';

import { createAction, io } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { getViewId } from '../selectors/reporting';

const local = {
  getOperations: createAction(actionTypes.REPORTING_GET_OPERATIONS),
  setView: createAction(actionTypes.REPORTING_SET_VIEW),
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

export const getGroupByMonth = (criteria) => async (dispatch, getState) => {
  const state = getState();

  const newViewId = await dispatch(io.call({
    service: 'reporting',
    method: 'notifyGroupByMonth',
    ... criteria
  }));

  const oldViewId = getViewId(state);
  if(oldViewId) {
    await dispatch(io.unnotify(oldViewId));
  }

  dispatch(local.setView(newViewId));
};

const clearReportingView = () => async (dispatch, getState) => {
  const state = getState();
  const viewId = getViewId(state);
  if(!viewId) {
    return;
  }

  await dispatch(io.unnotify(viewId));
  dispatch(local.setView(null));
};

export const reportingLeave = () => async (dispatch) => {
  await dispatch(clearReportingView());
};
