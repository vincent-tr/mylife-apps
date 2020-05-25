'use strict';

import { views, createAction } from 'mylife-tools-ui';
import { createDebouncedRefresh } from '../ref-view-tools';
import actionTypes from './action-types';
import { getRefCount } from './selectors';

const local = {
  ref: createAction(actionTypes.REF),
  unref: createAction(actionTypes.UNREF),
  setView: createAction(actionTypes.SET_VIEW),
};


const brokersViewRef = new views.ViewReference({
  uid: 'brokers',
  service: 'broker',
  method: 'notify'
});

async function refreshBrokersImpl(oldRefCount, newRefCount) {
  const wasRef = oldRefCount > 0;
  const isRef = newRefCount > 0;
  if(wasRef === isRef) {
    return;
  }

  await brokersViewRef.attach();

  if(isRef) {
    await brokersViewRef.attach();
  } else {
    await brokersViewRef.detach();
  }
}

const refreshBrokers = createDebouncedRefresh(refreshBrokersImpl);

export const refBrokerView = () => (dispatch, getState) => {
  const prevRef = getRefCount(getState());
  dispatch(local.ref());
  const currentRef = getRefCount(getState());
  refreshBrokers(prevRef, currentRef);
};

export const unrefBrokerView = () => (dispatch, getState) => {
  const prevRef = getRefCount(getState());
  dispatch(local.unref());
  const currentRef = getRefCount(getState());
  refreshBrokers(prevRef, currentRef);
};
