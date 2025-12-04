import { api, services } from 'mylife-tools';
import { Home, Stats, Tesla } from './api/services';
import stats from './stats/store';

export function buildAppServices(call: api.services.Call) {
  return {
    ...services.buildToolsServices(call),
    home: new Home(call),
    stats: new Stats(call),
    tesla: new Tesla(call),
  };
}

export const reducers = {
  stats,
};

services.initStore(reducers, buildAppServices);
