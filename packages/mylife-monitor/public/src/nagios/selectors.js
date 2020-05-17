'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getNagios = state => state.nagios;
export const getCriteria = state => getNagios(state).criteria;
export const getViewId = state => getNagios(state).viewId;
export const getView = state => io.getView(state, getViewId(state));

export const getDisplayView = createSelector(
  [ getView, getCriteria ],
  (view, criteria) => {
    const groups = new Map();
    const hosts = new Map();
    const services = new Map();

    for(const item of view.values()) {
      console.log(item);
    }

    return [];
  }
);
