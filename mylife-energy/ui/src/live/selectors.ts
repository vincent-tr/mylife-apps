import { createSelector } from '@reduxjs/toolkit';
import { DeviceType } from '../api';
import { AppState } from '../store-api';
import { getDevicesView, getMeasuresView } from './views';

export const getMeasure = (state: AppState, deviceId: string, sensorKey: string) => getMeasuresView(state)[`${deviceId}-${sensorKey}`];
export const getDevice = (state: AppState, deviceId: string) => getDevicesView(state)[deviceId];
export const getFirstDeviceByType = (state: AppState, deviceType: DeviceType) => Object.values(getDevicesView(state)).find((device) => device.type === deviceType);

export const makeGetDevicesByType = () =>
  createSelector([getDevicesView, (_state, deviceType: DeviceType) => deviceType], (view, deviceType) => Object.values(view).filter((device) => device.type === deviceType));
