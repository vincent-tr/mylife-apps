import { createSelector } from '@reduxjs/toolkit';
import { views } from 'mylife-tools';
import { DeviceType, LiveDevice, Measure } from '../api';
import * as viewSlots from './view-slots';

export const getDeviceView = (state) => views.getViewBySlot(state, viewSlots.DEVICES) as views.View<LiveDevice>;
export const getMeasureView = (state) => views.getViewBySlot(state, viewSlots.MEASURES) as views.View<Measure>;

export const getMeasure = (state, deviceId: string, sensorKey: string) => getMeasureView(state)[`${deviceId}-${sensorKey}`];
export const getDevice = (state, deviceId: string) => getDeviceView(state)[deviceId];
export const getFirstDeviceByType = (state, deviceType: DeviceType) => Object.values(getDeviceView(state)).find((device) => device.type === deviceType);

export const makeGetDevicesByType = () =>
  createSelector([getDeviceView, (_state, deviceType: DeviceType) => deviceType], (view, deviceType) => Object.values(view).filter((device) => device.type === deviceType));
