'use strict';

import { io } from 'mylife-tools-ui';

const getStats = state => state.suggestion;
export const getViewId = state => getStats(state).viewId;
export const getView = state => io.getView(state, getViewId(state));
