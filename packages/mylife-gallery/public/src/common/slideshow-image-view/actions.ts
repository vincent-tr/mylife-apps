'use strict';

import { views, createAction, services } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getViewId, getRefs } from './selectors';

const local = {
  ref: createAction(actionTypes.REF),
  unref: createAction(actionTypes.UNREF),
  setView: createAction(actionTypes.SET_VIEW),
};

const fetchSlideshowImages = () => views.createOrUpdateView({
  criteriaSelector: (state) => getCriteriaFromState(state),
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'slideshow',
  method: 'notifySlideshowsImages'
});

const clearSlideshowImages = () => views.deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

async function refreshSlideshowImagesImpl(oldRefs, newRefs) {
  if(oldRefs.keySeq().toSet().equals(newRefs.keySeq().toSet())) {
    return;
  }

  const store = services.getStore();
  if(newRefs.size > 0) {
    await store.dispatch(fetchSlideshowImages());
  } else {
    await store.dispatch(clearSlideshowImages());
  }
}

function getCriteriaFromState(state) {
  const refs = getRefs(state);
  const slideshows = refs.keySeq().toArray();
  return { criteria: { slideshows } };
}

const refreshSlideshowImages = views.createDebouncedRefresh(refreshSlideshowImagesImpl);

export const refSlideshowImageView = (slideshowId) => (dispatch, getState) => {
  const prevRef = getRefs(getState());
  dispatch(local.ref(slideshowId));
  const currentRef = getRefs(getState());
  refreshSlideshowImages(prevRef, currentRef);
};

export const unrefSlideshowImageView = (slideshowId) => (dispatch, getState) => {
  const prevRef = getRefs(getState());
  dispatch(local.unref(slideshowId));
  const currentRef = getRefs(getState());
  refreshSlideshowImages(prevRef, currentRef);
};
