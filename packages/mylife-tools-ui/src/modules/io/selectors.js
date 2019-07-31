'use strict';

import { getInternalState } from '../../selectors/base';

const getIo = state => getInternalState(state).io;

export const getOnline = state => getIo(state).online;
export const getView = (state, viewId) => getIo(state).views.get(viewId);
export const getViewItem = (state, viewId, itemId) => getIo(state).views.get(viewId).get(itemId);
export const getViewList = (state, viewId) => getIo(state).views.get(viewId).valueSeq().toArray();
