'use strict';

import { createAction, io } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { getViewId } from '../selectors/reporting';

const local = {
  setView: createAction(actionTypes.REPORTING_SET_VIEW),
};

export const getGroupByMonth = (criteria) => async (dispatch, getState) => {
  const state = getState();

  const viewId = getViewId(state);
  if(viewId) {
    await dispatch(io.call({
      service: 'reporting',
      method: 'renotifyGroupByMonth',
      viewId,
      ... criteria
    }));

    return;
  }

  const newViewId = await dispatch(io.call({
    service: 'reporting',
    method: 'notifyGroupByMonth',
    ... criteria
  }));

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
