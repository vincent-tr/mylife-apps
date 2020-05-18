'use strict';

import { io } from 'mylife-tools-ui';

const getHome = state => state.home;
export const getNagiosViewId = state => getHome(state).nagiosViewId;
export const getNagiosView = state => io.getView(state, getNagiosViewId(state));
