import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { views } from 'mylife-tools-ui';
import { HOST_STATUS_PROBLEM, SERVICE_STATUS_PROBLEM } from './problems';
import * as viewUids from './view-uids';

type FIXME_any = any;

interface NagiosState {
  criteria: Criteria;
}

interface Criteria {
  onlyProblems: boolean;
}

const initialState: NagiosState = {
  criteria: {
    onlyProblems: true,
  },
};

const nagiosSlice = createSlice({
  name: 'nagios',
  initialState,
  reducers: {
    setCriteria(state, action: PayloadAction<Criteria>) {
      state.criteria = action.payload;
    },
    resetCriteria(state, _action) {
      state.criteria = initialState.criteria;
    },
  },
  selectors: {
    getCriteria: (state) => state.criteria,
  },
});

const local = {
  getCriteria: nagiosSlice.selectors.getCriteria,
  setCriteria: nagiosSlice.actions.setCriteria,
};

export const resetCriteria = nagiosSlice.actions.resetCriteria;

export const changeCriteria = createAsyncThunk('nagios/changeCriteria', async (changes: Partial<Criteria>, api) => {
  const state = api.getState();
  const criteria = local.getCriteria(state as FIXME_any);
  const newCriteria = { ...criteria, ...changes };
  api.dispatch(local.setCriteria(newCriteria));
});

export const getCriteria = nagiosSlice.selectors.getCriteria;
export const getView = (state) => views.getView(state, viewUids.NAGIOS_DATA);

export const getDisplayView = createSelector([getView, getCriteria], (view: views.View<views.Entity>, criteria) => {
  const groups = new Map();
  const hosts = new Map();
  const services = new Map();

  for (const item of Object.values(view)) {
    switch (item._entity) {
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
  data.sort(createDisplayComparer('group'));

  for (const group of data) {
    group.hosts.sort(createDisplayComparer('host'));

    for (const host of group.hosts) {
      host.services.sort(createDisplayComparer(null));
    }
  }

  if (!criteria.onlyProblems) {
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

function createDisplayComparer(propName) {
  if (propName) {
    return (obj1, obj2) => (obj1[propName].display < obj2[propName].display ? -1 : 1);
  }
  return (obj1, obj2) => (obj1.display < obj2.display ? -1 : 1);
}

function groupHasProblem(item) {
  for (const host of item.hosts) {
    if (hostHasProblem(host)) {
      return true;
    }
  }

  return false;
}

function hostHasProblem(item) {
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

function serviceHasProblem(service) {
  return SERVICE_STATUS_PROBLEM[service.status];
}

export default nagiosSlice.reducer;
