import { views } from 'mylife-tools';
import * as api from '../api';
import { useSharedView } from '../views-api';

const NAGIOS_DATA = 'nagios-data';

export const getView = (state) => views.getViewBySlot<api.NagiosData>(state, NAGIOS_DATA);

export function useNagiosDataView() {
  return useSharedView<api.NagiosData>({
    slot: NAGIOS_DATA,
    viewCreatorApi: async (api) => api.nagios.notify(),
  });
}
