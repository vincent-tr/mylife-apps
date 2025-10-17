import { views, createSelector } from 'mylife-tools-ui';
import * as viewUids from './view-uids';
import { DeviceType, LiveDevice, Measure } from '../../../shared/metadata';

// const getLive = state => state.live;
export const getDeviceView = state => views.getView(state, viewUids.DEVICES) as views.View<LiveDevice>;
export const getMeasureView = state => views.getView(state, viewUids.MEASURES) as views.View<Measure>;

export const getMeasure = (state, deviceId: string, sensorKey: string) => getMeasureView(state).get(`${deviceId}-${sensorKey}`);
export const getDevice = (state, deviceId: string) => getDeviceView(state).get(deviceId);
export const getFirstDeviceByType = (state, deviceType: DeviceType) => getDeviceView(state).find(device => device.type === deviceType);
export const getDevicesByType = (state, deviceType: DeviceType) => getDeviceView(state).valueSeq().filter(device => device.type === deviceType);