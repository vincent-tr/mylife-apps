import { views } from 'mylife-tools';
import * as api from '../api';
import { AppState } from '../store-api';
import { useSharedView } from '../views-api';

const DEVICES = 'live-devices';
const MEASURES = 'live-measures';

export const getDevicesView = (state: AppState) => views.getViewBySlot<api.LiveDevice>(state, DEVICES);
export const getMeasuresView = (state: AppState) => views.getViewBySlot<api.Measure>(state, MEASURES);

export function useLiveDevicesView() {
  return useSharedView<api.LiveDevice>({
    slot: DEVICES,
    viewCreatorApi: async (api) => await api.live.notifyDevices(),
  });
}

export function useLiveMeasuresView() {
  return useSharedView<api.Measure>({
    slot: MEASURES,
    viewCreatorApi: async (api) => await api.live.notifyMeasures(),
  });
}
