'use strict';

import { views, createSelector } from 'mylife-tools-ui';

export const getBrokerView = state => views.getView(state, 'brokers');

export const getBrokers = createSelector(
  [ getBrokerView ],
  (view) => view.valueSeq().sortBy(broker => broker.display).toArray()
);
