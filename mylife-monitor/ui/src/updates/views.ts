import { views } from 'mylife-tools';
import * as api from '../api';
import { AppState } from '../store-api';
import { initStaticView } from '../views-api';

const UPDATES_DATA = 'updates-data';

export function initUpdatesView() {
  initStaticView({
    slot: UPDATES_DATA,
    viewCreatorApi: async (api) => await api.updates.notify(),
  });
}

export const getView = (state: AppState) => views.getViewBySlot<api.UpdatesVersion>(state, UPDATES_DATA);
