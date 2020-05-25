'use strict';

import { views } from 'mylife-tools-ui';

const brokerViewRef = new views.SharedViewReference({
  uid: 'brokers',
  service: 'broker',
  method: 'notify'
});

const getBrokers = views.createViewSelector((view) => view.valueSeq().sortBy(broker => broker.display).toArray());

export function useBrokerView() {
  return views.useSharedView(brokerViewRef, { brokers: getBrokers });
}

// ---

const strategyViewRef = new views.SharedViewReference({
  uid: 'strategies',
  service: 'strategy',
  method: 'notify'
});

const getStrategies = views.createViewSelector((view) => view.valueSeq().sortBy(strategy => strategy.display).toArray());

export function useStrategyView() {
  return views.useSharedView(strategyViewRef, { strategies: getStrategies });
}

// ---

const strategyStatusViewRef = new views.SharedViewReference({
  uid: 'strategy-status',
  service: 'strategy',
  method: 'notifyStatus'
});

export function useStrategyStatusView() {
  return views.useSharedView(strategyStatusViewRef);
}

// ---

const statViewRef = new views.SharedViewReference({
  uid: 'stats',
  service: 'stat',
  method: 'notify'
});

export function useStatView() {
  return views.useSharedView(statViewRef);
}

// ---

const errorViewRef = new views.SharedViewReference({
  uid: 'errors',
  service: 'error',
  method: 'notify'
});

export function useErrorView() {
  return views.useSharedView(errorViewRef);
}
