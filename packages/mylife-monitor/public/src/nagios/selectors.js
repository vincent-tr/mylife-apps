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
          groups.set(item._id, { group: item, children: [] });
          break;

        case 'nagios-host':
          hosts.set(item._id, { host: item, children: [] });
          break;

        case 'nagios-service':
          services.set(item._id, item);
          break;
      }
    }

    for(const service of services.values()) {
      const host = hosts.get(service.host);
      host.children.push(service);
    }

    for(const item of hosts.values()) {
      const { host } = item;
      const group = groups.get(host.group);
      group.children.push(item);
    }

    const data = Array.from(groups.values());
    data.sort(createDisplayComparer('group'));

    for(const group of data) {
      group.children.sort(createDisplayComparer('host'));

      for(const host of group.children) {
        host.children.sort(createDisplayComparer(null));
      }
    }

    return data;
  }
);

function createDisplayComparer(propName) {
  if(propName) {
    return (obj1, obj2) => obj1[propName].display < obj2[propName].display ? -1 : 1;
  }
  return (obj1, obj2) => obj1.display < obj2.display ? -1 : 1;
}
