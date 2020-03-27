'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getBase = state => state.commonBrokerView;
export const getViewId = state => getBase(state).viewId;
export const getBrokerView = state => io.getView(state, getViewId(state));

export const getBrokers = createSelector(
  [ getBrokerView ],
  (view) => view.valueSeq().sortBy(broker => broker.display).toArray()
);

export const getRefCount = state => getBase(state).refCount;
