'use strict';

import { getInternalState } from '../../selectors/base';
import * as io from '../io';

const getViews = state => getInternalState(state).views;

export const getViewId = (state, uid) => getViews(state).viewReferences.get(uid);
export const getView = (state, uid) => io.getView(state, getViewId(state, uid));

export const getRefCount = (state, uid) => getViews(state).refCounts.get(uid) || 0;
