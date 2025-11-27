import { createSelector } from '@reduxjs/toolkit';
import { views } from 'mylife-tools';
import { DeviceType, LiveDevice, Measure } from '../metadata';
import * as viewUids from './view-uids';

export const getDeviceView = (state) => views.getView(state, viewUids.DEVICES) as views.View<LiveDevice>;
export const getMeasureView = (state) => views.getView(state, viewUids.MEASURES) as views.View<Measure>;

export const getMeasure = (state, deviceId: string, sensorKey: string) => getMeasureView(state)[`${deviceId}-${sensorKey}`];
export const getDevice = (state, deviceId: string) => getDeviceView(state)[deviceId];
export const getFirstDeviceByType = (state, deviceType: DeviceType) => Object.values(getDeviceView(state)).find((device) => device.type === deviceType);

export const makeGetDevicesByType = () =>
  createSelector([getDeviceView, (state, deviceType: DeviceType) => deviceType], (view, deviceType) => Object.values(view).filter((device) => device.type === deviceType));
