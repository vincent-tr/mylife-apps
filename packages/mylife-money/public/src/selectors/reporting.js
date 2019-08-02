'use strict';

import { io } from 'mylife-tools-ui';

export const getOperations = (state) => state.reporting.operations.valueSeq().toArray();
export const getOperationStatsViewId = (state) => state.reporting.stats;
export const getOperationStatsView = state => io.getView(state, getOperationStatsViewId(state));
export const getTotalByMonthViewId = (state) => state.reporting.totalByMonth;
export const getTotalByMonthView = state => io.getView(state, getTotalByMonthViewId(state));
