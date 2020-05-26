'use strict';

import { views, createSelector } from 'mylife-tools-ui';
import { VIEW } from './view-ids';

const getSlideshows = state => state.slideshows;
export const getSelectedId = state => getSlideshows(state).selectedId;
const getView = state => views.getView(state, VIEW);

export const getDisplayView = createSelector(
  [ getView ],
  (view) => view.valueSeq().sortBy(slideshow => slideshow.name).toArray()
);
