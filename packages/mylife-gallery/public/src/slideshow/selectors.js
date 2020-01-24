'use strict';

import { io } from 'mylife-tools-ui';

const getSlideshowState = state => state.slideshow;
export const getSlideshowId = state => getSlideshowState(state).slideshowId;

export const getSlideshowViewId = state => getSlideshowState(state).slideshowViewId;
const getSlideshowView = state => io.getView(state, getSlideshowViewId(state));
export const getSlideshow = state => getSlideshowView(state).first();
