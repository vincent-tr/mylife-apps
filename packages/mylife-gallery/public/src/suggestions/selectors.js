'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getStats = state => state.suggestion;
export const getViewId = state => getStats(state).viewId;
const getView = state => io.getView(state, getViewId(state));

export const getSuggestions = createSelector(
  [ getView ],
  (view) => view.valueSeq().toArray()
);
