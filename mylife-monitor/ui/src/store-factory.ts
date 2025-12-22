import { api, services } from 'mylife-tools';
import { Nagios, Updates, UpsMon } from './api/services';
import { initNagiosView } from './nagios/views';
import { initUpdatesView } from './updates/views';
import { initUpsmonView } from './upsmon/views';

export function buildAppServices(call: api.services.Call) {
  return {
    ...services.buildToolsServices(call),
    nagios: new Nagios(call),
    updates: new Updates(call),
    upsmon: new UpsMon(call),
  };
}

export const reducers = {};

services.initStore(reducers, buildAppServices);

initNagiosView();
initUpdatesView();
initUpsmonView();
