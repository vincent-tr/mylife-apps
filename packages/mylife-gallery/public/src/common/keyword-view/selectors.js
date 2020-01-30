'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getBase = state => state.commonKeywordView;
export const getViewId = state => getBase(state).viewId;
export const getKeywordsView = state => io.getView(state, getViewId(state));

export const getKeywords = createSelector(
  [ getKeywordsView ],
  (view) => view.keySeq().sort().toArray()
);

export const getRefCount = state => getBase(state).refCount;
