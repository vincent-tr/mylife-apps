'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getBase = state => state.commonKeywordView;
export const getViewId = state => getBase(state).viewId;
export const getKeywordView = state => io.getView(state, getViewId(state));

export const getKeywords = createSelector(
  [ getKeywordView ],
  (view) => view.keySeq().sort().toArray()
);

export const getRefCount = state => getBase(state).refCount;
