'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getHome = state => state.home;

export const getStrategyViewId = state => getHome(state).strategyViewId;
const geStrategyView = state => io.getView(state, getStrategyViewId(state));

export const getStrategyDisplayView = createSelector(
  [ geStrategyView ],
  (view) => view.valueSeq().sortBy(strategy => strategy.display).toArray()
);

export const getStrategyStatusViewId = state => getHome(state).strategyStatusViewId;
export const geStrategyStatusView = state => io.getView(state, getStrategyStatusViewId(state));

export const getStatsViewId = state => getHome(state).statsViewId;
export const geStatsView = state => io.getView(state, getStatsViewId(state));
