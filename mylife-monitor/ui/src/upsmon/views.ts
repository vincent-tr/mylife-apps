import * as api from '../api';
import { useSharedView } from '../views-api';

const UPSMON_DATA = 'upsmon-data';

export function useUpsmonDataView() {
  return useSharedView<api.UpsmonStatus>({
    slot: UPSMON_DATA,
    viewCreatorApi: async (api) => api.upsmon.notify(),
  });
}
