import { views } from 'mylife-tools';
import * as api from '../api';
import { AppState } from '../store-api';
import { initStaticView } from '../views-api';

const NAGIOS_DATA = 'nagios-data';

export function initNagiosView() {
  initStaticView({
    slot: NAGIOS_DATA,
    viewCreatorApi: async (api) => await api.nagios.notify(),
  });
}

export const getView = (state: AppState) => views.getViewBySlot<api.NagiosData>(state, NAGIOS_DATA);
