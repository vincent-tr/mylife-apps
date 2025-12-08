import { views } from 'mylife-tools';
import * as api from '../api';
import { useSharedView } from '../views-api';
import { AppState } from '../store-api';

const UPDATES_DATA = 'updates-data';

export const getView = (state: AppState) => views.getViewBySlot<api.UpdatesVersion>(state, UPDATES_DATA);

export function useUpdatesDataView() {
  return useSharedView<api.UpdatesVersion>({
    slot: UPDATES_DATA,
    viewCreatorApi: async (api) => await api.updates.notify(),
  });
}
