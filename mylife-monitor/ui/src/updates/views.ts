import { views } from 'mylife-tools';

const UPDATES_DATA = 'updates-data';

export const getView = (state) => views.getViewBySlot(state, UPDATES_DATA);

export function useUpdatesData() {
  return views.useView({
    slot: UPDATES_DATA,
    service: 'updates',
    method: 'notify',
  });
}
