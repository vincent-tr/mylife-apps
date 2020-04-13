'use strict';

import { createAction, io } from 'mylife-tools-ui';
import { createOrSkipView, deleteView } from '../common/action-tools';
import actionTypes from './action-types';
import { getStrategyStatusViewId } from './selectors';

const local = {
  setStrategyStatusView: createAction(actionTypes.SET_STRATEGY_STATUS_VIEW),
};

const getStrategyStatus = () => createOrSkipView({
  viewSelector: getStrategyStatusViewId,
  setViewAction: local.setStrategyStatusView,
  service: 'strategy',
  method: 'notifyStatus'
});
    
const clearStrategyStatus = () => deleteView({
  viewSelector: getStrategyStatusViewId,
  setViewAction: local.setStrategyStatusView
});

export const enter = () => async (dispatch) => {
  await dispatch(getStrategyStatus());
};

export const leave = () => async (dispatch) => {
  await dispatch(clearStrategyStatus());
};

export const changeState = (strategy, enabled) => async (dispatch) => {
  await dispatch(io.call({
    service: 'strategy',
    method: 'update',
    id: strategy._id,
    values: { enabled }
  }));
};
