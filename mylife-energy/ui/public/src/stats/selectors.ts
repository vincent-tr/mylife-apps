import { createSelector } from 'reselect';
import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';
import { Device, Sensor } from '../../../shared/metadata';
import { StatsState } from './types';

const getStats = state => state.stats as StatsState;

export const getDevicesView = state => views.getView(state, viewUids.DEVICES) as views.View<Device>;

export interface TimestampData {
  timestamp: Date;
  measures: { [sensorId: string]: number };
}

export const getChartData = createSelector(
  [ state => getStats(state).measures ], 
  (measures) => {
    // Note: time range with no value will be omitted
    const map = new Map<number, TimestampData>();

    for (const measure of Object.values(measures)) {
      const mapId = measure.timestamp.valueOf();

      let item = map.get(mapId);
      if (!item) {
        item = { timestamp: measure.timestamp, measures: {} };
        map.set(mapId, item);
      }

      item.measures[measure.sensor] = measure.value;
    }

    const array = Array.from(map.values());
    array.sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf());
    return array;
  }
);

export type UiSensor = Sensor & { display: string };

export const getSensors = createSelector(
  [ 
    getDevicesView,
    state => getStats(state).sensors,
  ], 
  (devices, sensors) => {
    const deviceDisplay = new Map(devices.valueSeq().map(device => ([device.deviceId, device.display])));
    const array: UiSensor[] = Object.values(sensors).map(sensor => ({ ...sensor, display: deviceDisplay.get(sensor._id) }));
    array.sort((a, b) => a.display < b.display ? 1 : -1);
    return array;
  },
);
