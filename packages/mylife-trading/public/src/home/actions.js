'use strict';

import { createAction, io } from 'mylife-tools-ui';
import { createOrUpdateView, deleteView } from '../common/action-tools';
import actionTypes from './action-types';
import { getStrategyViewId, getStrategyStatusViewId, getStatsViewId } from './selectors';

const local = {
  setStrategyView: createAction(actionTypes.SET_STRATEGY_VIEW),
  setStrategyStatusView: createAction(actionTypes.SET_STRATEGY_STATUS_VIEW),
  seStatsView: createAction(actionTypes.SET_STATS_VIEW),
};

const getStrategies = () => createOrUpdateView({
  criteriaSelector: () => null,
  viewSelector: getStrategyViewId,
  setViewAction: local.setStrategyView,
  service: 'strategy',
  method: 'notify'
});
  
const clearStrategies = () => deleteView({
  viewSelector: getStrategyViewId,
  setViewAction: local.setStrategyView
});

const getStrategyStatus = () => createOrUpdateView({
  criteriaSelector: () => null,
  viewSelector: getStrategyStatusViewId,
  setViewAction: local.setStrategyStatusView,
  service: 'strategy',
  method: 'notifyStatus'
});
    
const clearStrategyStatus = () => deleteView({
  viewSelector: getStrategyStatusViewId,
  setViewAction: local.setStrategyStatusView
});

const getStats = () => createOrUpdateView({
  criteriaSelector: () => null,
  viewSelector: getStatsViewId,
  setViewAction: local.seStatsView,
  service: 'stat',
  method: 'notify'
});
    
const clearStats = () => deleteView({
  viewSelector: getStatsViewId,
  setViewAction: local.seStatsView
});
  
export const enter = () => async (dispatch) => {
  await dispatch(getStrategies());
  await dispatch(getStrategyStatus());
  await dispatch(getStats());
};

export const leave = () => async (dispatch) => {
  await dispatch(clearStrategies());
  await dispatch(clearStrategyStatus());
  await dispatch(clearStats());
};

export const changeState = (strategy, enabled) => async (dispatch) => {
  await dispatch(io.call({
    service: 'strategy',
    method: 'update',
    id: strategy._id,
    values: { enabled }
  }));
};
