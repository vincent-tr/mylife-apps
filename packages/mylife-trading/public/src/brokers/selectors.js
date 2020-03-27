'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getBrokers = state => state.brokers;
export const getViewId = state => getBrokers(state).viewId;
const getView = state => io.getView(state, getViewId(state));

export const getDisplayView = createSelector(
  [ getView ],
  (view) => view.valueSeq().sortBy(broker => broker.display).toArray()
);
