'use strict';

import { createAction, views } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getSlideshowId } from './selectors';
import { VIEW } from './view-ids';

const viewRef = new views.ViewReference({
  uid: VIEW,
  criteriaSelector: (state) => ({ id: getSlideshowId(state) }),
  service: 'slideshow',
  method: 'notifySlideshow'
});

const setSlideshowId = createAction(actionTypes.SET_SLIDESHOW_ID);

export const enter = (slideshowId) => async (dispatch) => {
  dispatch(setSlideshowId(slideshowId));
  await viewRef.attach();
};

export const leave = () => async (dispatch) => {
  dispatch(setSlideshowId(null));
  await viewRef.detach();
};
