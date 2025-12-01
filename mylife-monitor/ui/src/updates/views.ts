import { views } from 'mylife-tools';
import * as api from '../api';

const UPDATES_DATA = 'updates-data';

export const getView = (state) => views.getViewBySlot<api.UpdatesVersion>(state, UPDATES_DATA);

export function useUpdatesDataView() {
  return views.useSharedView<api.UpdatesVersion>({
    slot: UPDATES_DATA,
    service: 'updates',
    method: 'notify',
  });
}
