'use strict';

import { io } from 'mylife-tools-ui';

export const getOperations = (state) => state.reporting.operations.valueSeq().toArray();
export const getViewId = (state) => state.reporting.view;
export const getView = state => io.getView(state, getViewId(state));
