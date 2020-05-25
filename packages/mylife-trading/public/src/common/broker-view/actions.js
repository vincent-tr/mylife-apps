'use strict';

import { views } from 'mylife-tools-ui';

const brokersViewRef = new views.SharedViewReference({
  uid: 'brokers',
  service: 'broker',
  method: 'notify'
});

export const refBrokerView = () => (dispatch, getState) => {
  brokersViewRef.ref();
};

export const unrefBrokerView = () => (dispatch, getState) => {
  brokersViewRef.unref();
};
