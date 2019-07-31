'use strict';

import Immutable from 'immutable';
import { getInternalState } from '../../selectors/base';

const getIo = state => getInternalState(state).io;

const emptyView = new Immutable.Map();

export const getOnline = state => getIo(state).online;
export const getView = (state, viewId) => getIo(state).views.get(viewId) || emptyView;
export const getViewItem = (state, viewId, itemId) => getView(state, viewId).get(itemId);
export const getViewList = (state, viewId) => getView(state, viewId).valueSeq().toArray();
