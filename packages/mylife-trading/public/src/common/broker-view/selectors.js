'use strict';

import { views, createSelector } from 'mylife-tools-ui';

const getBase = state => state.commonBrokerView;
export const getBrokerView = state => views.getViewReference(state, 'brokers');

export const getBrokers = createSelector(
  [ getBrokerView ],
  (view) => view.valueSeq().sortBy(broker => broker.display).toArray()
);

export const getRefCount = state => getBase(state).refCount;
