'use strict';

import { io, createSelector, immutable } from 'mylife-tools-ui';

const getBase = state => state.commonSlideshowImageView;
export const getViewId = state => getBase(state).viewId;
export const getSlideshowImageView = state => io.getView(state, getViewId(state));

const getImagesBySlideshow = createSelector(
  [ getSlideshowImageView ],
  (view) => {
    const map = new Map();
    for(const item of view.valueSeq()) {
      let list = map.get(item.slideshow);
      if(!list) {
        list = [];
        map.set(item.slideshow, list);
      }
      list.push(item);
    }

    for(const [key, list] of map) {
      list.sort((it1, it2) => it1.index - it2.index);
      map.set(key, new immutable.List(list));
    }

    return new immutable.Map(map);
  }
);

const emptyList = new immutable.List();

export const getSlideshowImages = (state, slideshowId) => getImagesBySlideshow(state).get(slideshowId) || emptyList;

export const getRefs = state => getBase(state).refs;
