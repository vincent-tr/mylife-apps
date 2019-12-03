'use strict';

import { io } from 'mylife-tools-ui';

const getBrowse = state => state.browse;
export const getViewId = state => getBrowse(state).viewId;
const getView = state => io.getView(state, getViewId(state));
export const getDisplay = state => getBrowse(state).display;
export const getDisplayView = getView; // TODO: apply display options (sort)
