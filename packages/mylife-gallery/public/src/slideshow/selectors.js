'use strict';

import { views } from 'mylife-tools-ui';
import { VIEW } from './view-ids';

const getSlideshowState = state => state.slideshow;
export const getSlideshowId = state => getSlideshowState(state).slideshowId;
export const getSlideshow = state => views.getView(state, VIEW).first();
