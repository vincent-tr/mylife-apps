'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getHome = state => state.strategies;

export const getStrategyViewId = state => getHome(state).viewId;
const geStrategyView = state => io.getView(state, getStrategyViewId(state));

export const getStrategyDisplayView = createSelector(
  [ geStrategyView ],
  (view) => view.valueSeq().sortBy(strategy => strategy.display).toArray()
);

export const getStrategyStatusViewId = state => getHome(state).viewId;
export const geStrategyStatusView = state => io.getView(state, getStrategyStatusViewId(state));
