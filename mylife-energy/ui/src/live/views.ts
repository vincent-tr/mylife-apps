import { views } from 'mylife-tools';
import * as api from '../api';

const DEVICES = 'live-devices';
const MEASURES = 'live-measures';

export const getDevicesView = (state) => views.getViewBySlot<api.LiveDevice>(state, DEVICES);
export const getMeasuresView = (state) => views.getViewBySlot<api.Measure>(state, MEASURES);

export function useLiveDevicesView() {
  return views.useSharedView<api.LiveDevice>({
    slot: DEVICES,
    service: 'live',
    method: 'notifyDevices',
  });
}

export function useLiveMeasuresView() {
  return views.useSharedView<api.Measure>({
    slot: MEASURES,
    service: 'live',
    method: 'notifyMeasures',
  });
}
