import { views } from 'mylife-tools';
import * as api from '../api';
import { AppState } from '../store-api';
import { initStaticView } from '../views-api';

const UPSMON_DATA = 'upsmon-data';

export function initUpsmonView() {
  initStaticView({
    slot: UPSMON_DATA,
    viewCreatorApi: async (api) => await api.upsmon.notify(),
  });
}

export const getView = (state: AppState) => views.getViewBySlot<api.UpsmonStatus>(state, UPSMON_DATA);