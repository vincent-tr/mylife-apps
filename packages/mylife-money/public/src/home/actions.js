'use strict';

import { createAction, io } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { getOperationStatsViewId, getTotalByMonthViewId } from './selectors';

const local = {
  setOperationStatsView: createAction(actionTypes.HOME_SET_OPERATION_STATS_VIEW),
  setTotalByMonthView: createAction(actionTypes.HOME_SET_TOTAL_BY_MONTH_VIEW),
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

const getTotalByMonth = () => async (dispatch) => {
  const viewId = await dispatch(io.call({
    service: 'reporting',
    method: 'notifyTotalByMonth',
  }));

  dispatch(local.setTotalByMonthView(viewId));
};

const clearTotalByMonth = () => async (dispatch, getState) => {
  const state = getState();
  const viewId = getTotalByMonthViewId(state);
  if(!viewId) {
    return;
  }

  await dispatch(io.unnotify(viewId));
  dispatch(local.setTotalByMonthView(null));
};

export const homeEnter = () => async (dispatch) => {
  await dispatch(getOperationStats());
  await dispatch(getTotalByMonth());
};

export const homeLeave = () => async (dispatch) => {
  await dispatch(clearOperationStats());
  await dispatch(clearTotalByMonth());
};
