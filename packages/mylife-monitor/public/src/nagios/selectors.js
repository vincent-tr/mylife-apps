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
      switch(item._entity) {

        case 'nagios-host-group':
          groups.set(item._id, item);
          break;

        case 'nagios-host':
          hosts.set(item._id, item);
          break;

        case 'nagios-service':
          services.set(item._id, item);
          break;
      }
    }

    return [];
  }
);
