import { views } from 'mylife-tools';
import * as api from '../api';

const NAGIOS_DATA = 'nagios-data';

export const getView = (state) => views.getViewBySlot<api.NagiosData>(state, NAGIOS_DATA);

export function useNagiosDataView() {
  return views.useSharedView<api.NagiosData>({
    slot: NAGIOS_DATA,
    service: 'nagios',
    method: 'notify',
  });
}
