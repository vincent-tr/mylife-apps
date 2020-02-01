'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getStats = state => state.suggestion;
export const getViewId = state => getStats(state).viewId;
const getView = state => io.getView(state, getViewId(state));

export const getSuggestions = createSelector(
  [ getView ],
  (view) => view.valueSeq().sort(suggestionComparer).toArray()
);

export const getDialogObjects = state => getStats(state).dialogObjects;

const TYPE_ORDER = {
  'warn-syncing': 0,
  'clean-others': 1,
  'clean-duplicates': 2,
  'album-creation': 3,
};

function suggestionComparer(sug1, sug2) {
  // sort by type
  if(sug1.type === sug2.type) {
    return sug1._id < sug2._id ? -1 : 1;
  }

  return TYPE_ORDER[sug1.type] - TYPE_ORDER[sug2.type];
}
