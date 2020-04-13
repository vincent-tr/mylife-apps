'use strict';

import { io } from 'mylife-tools-ui';

const getHome = state => state.home;

export const getStrategyStatusViewId = state => getHome(state).strategyStatusViewId;
export const geStrategyStatusView = state => io.getView(state, getStrategyStatusViewId(state));
