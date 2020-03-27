'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getStrategies = state => state.strategies;
export const getViewId = state => getStrategies(state).viewId;
const getView = state => io.getView(state, getViewId(state));

export const getDisplayView = createSelector(
  [ getView ],
  (view) => view.valueSeq().sortBy(strategy => strategy.display).toArray()
);
