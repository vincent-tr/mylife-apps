import { api, services } from 'mylife-tools';
import { Bots, Management, Reporting } from './api/services';
import management from './management/store';
import { initReferenceViews } from './reference/views';
import reporting from './reporting/store';

export function buildAppServices(call: api.services.Call) {
  return {
    ...services.buildToolsServices(call),
    bots: new Bots(call),
    management: new Management(call),
    reporting: new Reporting(call),
  };
}

export const reducers = {
  management,
  reporting,
};

services.initStore(reducers, buildAppServices);

initReferenceViews();
