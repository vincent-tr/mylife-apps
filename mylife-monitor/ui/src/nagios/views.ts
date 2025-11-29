import { views } from 'mylife-tools';

const NAGIOS_DATA = 'nagios-data';

export const getView = (state) => views.getViewBySlot(state, NAGIOS_DATA);

export function useNagiosData() {
  return views.useView({
    slot: NAGIOS_DATA,
    service: 'nagios',
    method: 'notify',
  });
}
