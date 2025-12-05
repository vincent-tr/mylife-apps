import { api, services } from 'mylife-tools';
import { Nagios, Updates, UpsMon } from './api/services';
import nagios from './nagios/store';
import updates from './updates/store';

export function buildAppServices(call: api.services.Call) {
  return {
    ...services.buildToolsServices(call),
    nagios: new Nagios(call),
    updates: new Updates(call),
    upsmon: new UpsMon(call),
  };
}

export const reducers = {
  nagios,
  updates,
};

services.initStore(reducers, buildAppServices);
