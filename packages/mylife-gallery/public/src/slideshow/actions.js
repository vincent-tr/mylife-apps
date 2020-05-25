'use strict';

import { createAction, views } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getSlideshowId, getSlideshowViewId } from './selectors';

const local = {
  setSlideshowId: createAction(actionTypes.SET_SLIDESHOW_ID),
  setSlideshowView: createAction(actionTypes.SET_SLIDESHOW_VIEW),
};

const fetchSlideshow = () => views.createOrUpdateView({
  criteriaSelector: (state) => ({ id: getSlideshowId(state) }),
  viewSelector: getSlideshowViewId,
  setViewAction: local.setSlideshowView,
  service: 'slideshow',
  method: 'notifySlideshow'
});

const clearSlideshows = () => views.deleteView({
  viewSelector: getSlideshowViewId,
  setViewAction: local.setSlideshowView
});

export const enter = (slideshowId) => async (dispatch) => {
  dispatch(local.setSlideshowId(slideshowId));
  await dispatch(fetchSlideshow());
};

export const leave = () => async (dispatch) => {
  dispatch(local.setSlideshowId(null));
  await dispatch(clearSlideshows());
};
