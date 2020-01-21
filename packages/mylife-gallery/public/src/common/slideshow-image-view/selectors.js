'use strict';

import { io, createSelector, immutable } from 'mylife-tools-ui';

const getBase = state => state.commonSlideshowImageView;
export const getViewId = state => getBase(state).viewId;
export const getSlideshowImageView = state => io.getView(state, getViewId(state));

const getImagesBySlideshow = createSelector(
  [ getSlideshowImageView ],
  (view) => new immutable.Map().withMutations(map => {
    // TODO
  })
);

export const getSlideshowImages = (state, slideshowId) => getImagesBySlideshow(state).get(slideshowId);

export const getRefs = state => getBase(state).refs;
