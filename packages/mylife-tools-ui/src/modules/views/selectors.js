'use strict';

import { getInternalState } from '../../selectors/base';
import * as io from '../io';

const getViews = state => getInternalState(state).views;

export const getViewReferenceId = (state, uid) => getViews(state).viewReferences.get(uid);
export const getViewReference = (state, uid) => io.getView(state, getViewReferenceId(state, uid));
