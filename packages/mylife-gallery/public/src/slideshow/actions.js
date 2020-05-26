'use strict';

import { views } from 'mylife-tools-ui';
import { VIEW } from './view-ids';

const viewRef = new views.ViewReference({
  uid: VIEW,
  criteriaSelector: (state, { slideshowId }) => ({ id: slideshowId }),
  service: 'slideshow',
  method: 'notifySlideshow'
});

export const enter = (slideshowId) => async (dispatch) => {
  await viewRef.attach({ slideshowId });
};

export const leave = () => async (dispatch) => {
  await viewRef.detach();
};
