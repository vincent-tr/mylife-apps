import { views } from 'mylife-tools';
import * as api from '../api';
import { AppState } from '../store-api';
import { useSharedView } from '../views-api';

const DEVICES = 'devices';

export const getDevicesView = (state: AppState) => views.getViewBySlot<api.Device>(state, DEVICES);

export function useDevicesView() {
  return useSharedView<api.Device>({
    slot: DEVICES,
    viewCreatorApi: async (api) => await api.stats.notifyDevices(),
  });
}
