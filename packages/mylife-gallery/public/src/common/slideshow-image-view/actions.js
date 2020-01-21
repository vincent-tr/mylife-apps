'use strict';

import { Mutex } from 'async-mutex';
import { createAction } from 'mylife-tools-ui';
import { createOrUpdateView, deleteView } from '../action-tools';
import actionTypes from './action-types';
import { getViewId, getRefs } from './selectors';

const local = {
  ref: createAction(actionTypes.REF),
  unref: createAction(actionTypes.UNREF),
  setView: createAction(actionTypes.SET_VIEW),
};

const fetchSlideshowsImages = () => createOrUpdateView({
  criteriaSelector: (state) => getCriteriaFromState(state),
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'slideshow',
  method: 'notifySlideshowsImages'
});

const clearSlideshowImages = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

// needed  because fetchSlideshowsImages/clearSlideshowImages is not atomic
const mutex = new Mutex();

export const refSlideshowImageView = (slideshowId) => async (dispatch, getState) => {
  await mutex.runExclusive(async () => {

    const wasRef = isRef(getState(), slideshowId);
    dispatch(local.ref(slideshowId));

    // first ref to this slideshow, need to fetch it
    if(!wasRef) {
      await dispatch(fetchSlideshowsImages());
    }

  });
};

export const unrefSlideshowImageView = (slideshowId) => async (dispatch, getState) => {
  await mutex.runExclusive(async () => {

    dispatch(local.unref(slideshowId));
    const state = getState();

    if(!isAnyRef(state)) {
      // no ref amymore, release view
      await dispatch(clearSlideshowImages());
    } else if(!isRef(state, slideshowId)) {
      // not ref to this slideshow anymore, fetch view without this one
      await dispatch(fetchSlideshowsImages());
    }
    
  });
};

function getCriteriaFromState(state) {
  const refs = getRefs(state);
  const slideshows = refs.keySeq().toArray();
  return { criteria: { slideshows } };
}

function isRef(state, slideshowId) {
  const refs = getRefs(state);
  return refs.has(slideshowId);
}

function isAnyRef(state) {
  const refs = getRefs(state);
  return refs.size > 0;
}
