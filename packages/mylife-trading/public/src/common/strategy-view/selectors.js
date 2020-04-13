'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getBase = state => state.commonStrategyView;
export const getViewId = state => getBase(state).viewId;
export const getStrategyView = state => io.getView(state, getViewId(state));

export const getStrategies = createSelector(
  [ getStrategyView ],
  (view) => view.valueSeq().sortBy(strategy => strategy.display).toArray()
);

export const getRefCount = state => getBase(state).refCount;
