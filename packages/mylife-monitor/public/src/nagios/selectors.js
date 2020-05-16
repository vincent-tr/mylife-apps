'use strict';

import { io } from 'mylife-tools-ui';

const getNagios = state => state.nagios;
export const getViewId = state => getNagios(state).viewId;
export const getView = state => io.getView(state, getViewId(state));
