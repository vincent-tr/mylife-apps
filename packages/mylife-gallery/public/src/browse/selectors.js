'use strict';

import { io } from 'mylife-tools-ui';

const getBrowse = state => state.browse;
export const getViewId = state => getBrowse(state).viewId;
const getView = state => io.getView(state, getViewId(state));
export const getDisplay = state => getBrowse(state).display;
export const getDisplayView = state => getView(state).valueSeq().toArray(); // TODO: apply display options (sort)
