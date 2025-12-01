import { views } from 'mylife-tools';
import * as api from '../api';

const DEVICES = 'devices';

export const getDevicesView = (state) => views.getViewBySlot<api.Device>(state, DEVICES);

export function useDevicesView() {
  return views.useSharedView<api.Device>({
    slot: DEVICES,
    service: 'stats',
    method: 'notifyDevices',
  });
}
