'use strict';

import { io } from 'mylife-tools-ui';

const getBase = state => state.commonStatView;
export const getViewId = state => getBase(state).viewId;
export const getStatView = state => io.getView(state, getViewId(state));

export const getRefCount = state => getBase(state).refCount;
