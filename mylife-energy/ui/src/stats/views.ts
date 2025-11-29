import { views } from 'mylife-tools';
import { Device } from '../api';

const DEVICES = 'devices';

export const getDevicesView = (state) => views.getViewBySlot(state, DEVICES) as views.View<Device>;

export function useDevicesView() {
  return views.useView({
    slot: DEVICES,
    service: 'stats',
    method: 'notifyDevices',
  });
}
