'use strict';

import { io } from 'mylife-tools-ui';

export const getViewId = (state) => state.stats.viewId;
export const getView = state => io.getView(state, getViewId(state));
