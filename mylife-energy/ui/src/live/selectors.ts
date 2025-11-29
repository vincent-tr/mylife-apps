import { createSelector } from '@reduxjs/toolkit';
import { DeviceType } from '../api';
import { getDevicesView, getMeasuresView } from './views';

export const getMeasure = (state, deviceId: string, sensorKey: string) => getMeasuresView(state)[`${deviceId}-${sensorKey}`];
export const getDevice = (state, deviceId: string) => getDevicesView(state)[deviceId];
export const getFirstDeviceByType = (state, deviceType: DeviceType) => Object.values(getDevicesView(state)).find((device) => device.type === deviceType);

export const makeGetDevicesByType = () =>
  createSelector([getDevicesView, (_state, deviceType: DeviceType) => deviceType], (view, deviceType) => Object.values(view).filter((device) => device.type === deviceType));
