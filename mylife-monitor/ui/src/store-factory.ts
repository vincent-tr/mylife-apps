import { api, services } from 'mylife-tools';
import nagios from './nagios/store';
import updates from './updates/store';

export function buildAppServices(call: api.services.Call) {
  return {
    ...services.buildToolsServices(call),
  };
}

export const reducers = {
  nagios,
  updates,
};

services.initStore(reducers, buildAppServices);
