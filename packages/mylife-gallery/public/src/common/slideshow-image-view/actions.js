'use strict';

import { io, createAction } from 'mylife-tools-ui';
import { createDebouncedRefresh } from '../ref-view-tools';
import actionTypes from './action-types';
import { getViewId, getRefs } from './selectors';

const local = {
  ref: createAction(actionTypes.REF),
  unref: createAction(actionTypes.UNREF),
  setView: createAction(actionTypes.SET_VIEW),
};

const fetchSlideshowImages = () => io.createOrUpdateView({
  criteriaSelector: (state) => getCriteriaFromState(state),
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'slideshow',
  method: 'notifySlideshowsImages'
});

const clearSlideshowImages = () => io.deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

async function refreshSlideshowImagesImpl(dispatch, oldRefs, newRefs) {
  if(oldRefs.keySeq().toSet().equals(newRefs.keySeq().toSet())) {
    return;
  }

  if(newRefs.size > 0) {
    await dispatch(fetchSlideshowImages());
  } else {
    await dispatch(clearSlideshowImages());
  }
}

function getCriteriaFromState(state) {
  const refs = getRefs(state);
  const slideshows = refs.keySeq().toArray();
  return { criteria: { slideshows } };
}

const refreshSlideshowImages = createDebouncedRefresh(refreshSlideshowImagesImpl);

export const refSlideshowImageView = (slideshowId) => (dispatch, getState) => {
  const prevRef = getRefs(getState());
  dispatch(local.ref(slideshowId));
  const currentRef = getRefs(getState());
  refreshSlideshowImages(dispatch, prevRef, currentRef);
};

export const unrefSlideshowImageView = (slideshowId) => (dispatch, getState) => {
  const prevRef = getRefs(getState());
  dispatch(local.unref(slideshowId));
  const currentRef = getRefs(getState());
  refreshSlideshowImages(dispatch, prevRef, currentRef);
};
