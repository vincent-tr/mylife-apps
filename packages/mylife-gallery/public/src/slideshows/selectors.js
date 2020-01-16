'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getSlideshows = state => state.slideshows;
export const getViewId = state => getSlideshows(state).viewId;
const getView = state => io.getView(state, getViewId(state));

export const getDisplayView = createSelector(
  [ getView ],
  (view) => view.valueSeq().sortBy(slideshow => slideshow.name).toArray()
);
