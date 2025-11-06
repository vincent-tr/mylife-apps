'use strict';

import { createSelector } from 'reselect';
import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';
import { HOST_STATUS_PROBLEM, SERVICE_STATUS_PROBLEM } from './problems';

const getNagios = state => state.nagios;
export const getCriteria = state => getNagios(state).criteria;
export const getView = state => views.getView(state, viewUids.NAGIOS_DATA);

export const getDisplayView = createSelector(
  [ getView, getCriteria ],
  (view, criteria) => {
    const groups = new Map();
    const hosts = new Map();
    const services = new Map();

    for(const item of view.values()) {
      switch(item._entity) {

        case 'nagios-host-group':
          groups.set(item._id, { group: item, hosts: [] });
          break;

        case 'nagios-host':
          hosts.set(item._id, { host: item, services: [] });
          break;

        case 'nagios-service':
          services.set(item._id, item);
          break;
      }
    }

    for(const service of services.values()) {
      const host = hosts.get(service.host);
      host.services.push(service);
    }

    for(const item of hosts.values()) {
      const { host } = item;
      const group = groups.get(host.group);
      group.hosts.push(item);
    }

    const data = Array.from(groups.values());
    data.sort(createDisplayComparer('group'));

    for(const group of data) {
      group.hosts.sort(createDisplayComparer('host'));

      for(const host of group.hosts) {
        host.services.sort(createDisplayComparer(null));
      }
    }

    if(!criteria.onlyProblems) {
      return data;
    }

    const filtered = data.filter(groupHasProblem);
    for(const group of filtered) {
      group.hosts = group.hosts.filter(hostHasProblem);

      for(const host of group.hosts) {
        host.services = host.services.filter(serviceHasProblem);
      }
    }

    return filtered;
  }
);

function createDisplayComparer(propName) {
  if(propName) {
    return (obj1, obj2) => obj1[propName].display < obj2[propName].display ? -1 : 1;
  }
  return (obj1, obj2) => obj1.display < obj2.display ? -1 : 1;
}
  
function groupHasProblem(item) {
  for(const host of item.hosts) {
    if(hostHasProblem(host)) {
      return true;
    }
  }

  return false;
}

function hostHasProblem(item) {
  if(HOST_STATUS_PROBLEM[item.host.status]) {
    return true;
  }

  for(const service of item.services) {
    if(serviceHasProblem(service)) {
      return true;
    }
  }

  return false;
}

function serviceHasProblem(service) {
  return SERVICE_STATUS_PROBLEM[service.status];
}