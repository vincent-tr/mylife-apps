'use strict';

import { io } from 'mylife-tools-ui';

const getBase = state => state.commonErrorView;
export const getViewId = state => getBase(state).viewId;
export const getErrorView = state => io.getView(state, getViewId(state));

export const getRefCount = state => getBase(state).refCount;
