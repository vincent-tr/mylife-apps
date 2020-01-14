'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getHome = state => state.home;
export const getViewId = state => getHome(state).viewId;
const getView = state => io.getView(state, getViewId(state));
export const getCriteria = state => getHome(state).criteria;
export const getDisplay = state => getHome(state).display;

export const getDisplayView = createSelector(
  [ getView, getDisplay ],
  (view, display) => {

    return view.valueSeq().toArray();

    // TODO

  }
);
