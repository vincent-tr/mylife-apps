'use strict';

import { views } from 'mylife-tools-ui';

const brokerViewRef = new views.SharedViewReference({
  uid: 'shared-brokers',
  service: 'broker',
  method: 'notify'
});

const getBrokers = views.createViewSelector((view) => view.valueSeq().sortBy(broker => broker.display).toArray());

export function useBrokerView() {
  return views.useSharedView(brokerViewRef, { brokers: getBrokers });
}

// ---

const strategyViewRef = new views.SharedViewReference({
  uid: 'shared-strategies',
  service: 'strategy',
  method: 'notify'
});

const getStrategies = views.createViewSelector((view) => view.valueSeq().sortBy(strategy => strategy.display).toArray());

export function useStrategyView() {
  return views.useSharedView(strategyViewRef, { strategies: getStrategies });
}

// ---

const statViewRef = new views.SharedViewReference({
  uid: 'shared-stat',
  service: 'stat',
  method: 'notify'
});

export function useStatView() {
  return views.useSharedView(statViewRef);
}

// ---

const errorViewRef = new views.SharedViewReference({
  uid: 'shared-error',
  service: 'error',
  method: 'notify'
});

export function useErrorView() {
  return views.useSharedView(errorViewRef);
}
