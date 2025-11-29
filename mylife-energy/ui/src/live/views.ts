import { views } from 'mylife-tools';
import { LiveDevice, Measure } from '../api';

const DEVICES = 'live-devices';
const MEASURES = 'live-measures';

export const getDevicesView = (state) => views.getViewBySlot(state, DEVICES) as views.View<LiveDevice>;
export const getMeasuresView = (state) => views.getViewBySlot(state, MEASURES) as views.View<Measure>;

export function useLiveDevicesView() {
  return views.useView({
    slot: DEVICES,
    service: 'live',
    method: 'notifyDevices',
  });
}

export function useLiveMeasuresView() {
  return views.useView({
    slot: MEASURES,
    service: 'live',
    method: 'notifyMeasures',
  });
}
