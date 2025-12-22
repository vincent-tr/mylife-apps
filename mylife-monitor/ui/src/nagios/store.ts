import { createSelector } from '@reduxjs/toolkit';
import { api, views } from 'mylife-tools';
import { NagiosHostGroup, NagiosHost, NagiosService } from '../api';
import { getView } from './views';

export interface GroupWithHosts {
  group: NagiosHostGroup;
  hosts: HostWithServices[];
}

export interface HostWithServices {
  host: NagiosHost;
  services: NagiosService[];
}

export const HOST_STATUS_PROBLEM = {
  pending: false,
  up: false,
  down: true,
  unreachable: true,
};

export const SERVICE_STATUS_PROBLEM = {
  pending: false,
  ok: false,
  warning: true,
  unknown: true,
  critical: true,
};

export const getDisplayView = createSelector([
  getView, 
  (_state, onlyProblems: boolean) => onlyProblems,
], (view: views.View<api.Entity>, onlyProblems) => {
  const groups = new Map<string, GroupWithHosts>();
  const hosts = new Map<string, HostWithServices>();
  const services = new Map<string, NagiosService>();

  for (const item of Object.values(view)) {
    switch (item._entity) {
      case 'nagios-host-group':
        groups.set(item._id, { group: item as NagiosHostGroup, hosts: [] });
        break;

      case 'nagios-host':
        hosts.set(item._id, { host: item as NagiosHost, services: [] });
        break;

      case 'nagios-service':
        services.set(item._id, item as NagiosService);
        break;
    }
  }

  for (const service of services.values()) {
    const host = hosts.get(service.host);
    host.services.push(service);
  }

  for (const item of hosts.values()) {
    const { host } = item;
    const group = groups.get(host.group);
    group.hosts.push(item);
  }

  const data = Array.from(groups.values());
  data.sort(sortBy((group) => group.group.display));

  for (const group of data) {
    group.hosts.sort(sortBy((host) => host.host.display));

    for (const host of group.hosts) {
      host.services.sort(sortBy((service) => service.display));
    }
  }

  if (!onlyProblems) {
    return data;
  }

  const filtered = data.filter(groupHasProblem);
  for (const group of filtered) {
    group.hosts = group.hosts.filter(hostHasProblem);

    for (const host of group.hosts) {
      host.services = host.services.filter(serviceHasProblem);
    }
  }

  return filtered;
});

function sortBy<T>(accessor: (item: T) => unknown) {
  return (obj1: T, obj2: T) => (accessor(obj1) < accessor(obj2) ? -1 : 1);
}

function groupHasProblem(item: GroupWithHosts) {
  for (const host of item.hosts) {
    if (hostHasProblem(host)) {
      return true;
    }
  }

  return false;
}

function hostHasProblem(item: HostWithServices) {
  if (HOST_STATUS_PROBLEM[item.host.status]) {
    return true;
  }

  for (const service of item.services) {
    if (serviceHasProblem(service)) {
      return true;
    }
  }

  return false;
}


function serviceHasProblem(service: NagiosService) {
  return SERVICE_STATUS_PROBLEM[service.status];
}
