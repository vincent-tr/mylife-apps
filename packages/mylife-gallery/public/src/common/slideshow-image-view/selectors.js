'use strict';

import { io } from 'mylife-tools-ui';

const getBase = state => state.commonSlideshowImageView;
export const getViewId = state => getBase(state).viewId;
export const getSlideshowImageView = state => io.getView(state, getViewId(state));

export const getRefs = state => getBase(state).refs;
