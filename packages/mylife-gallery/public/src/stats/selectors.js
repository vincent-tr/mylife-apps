'use strict';

import { io } from 'mylife-tools-ui';

const getStats = state => state.stats;
export const getViewId = state => getStats(state).viewId;
export const getView = state => io.getView(state, getViewId(state));
