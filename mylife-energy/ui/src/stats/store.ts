import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from 'mylife-tools';
import { Measure, Sensor } from '../api';
import { SensorData, StatsType, TimestampData, UiSensor } from './types';
import { getDevicesView } from './views';

interface StatsState {
  sensors: { [id: string]: SensorData };
  measures: { [id: string]: Measure };
}

type SetValues = {
  sensor: Sensor;
  measures: Measure[];
}[];

const initialState: StatsState = {
  sensors: {},
  measures: {},
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setValues(state, action: PayloadAction<SetValues>) {
      const sensors: { [id: string]: SensorData } = {};
      const measures: { [id: string]: Measure } = {};

      for (const item of action.payload) {
        const sensor: SensorData = { ...item.sensor, measures: [] };
        sensors[sensor._id] = sensor;

        const measuresList = item.measures.slice();
        measuresList.sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf());

        for (const measure of measuresList) {
          // make a reducer-wide unique id
          const id = `${sensor._id}:${measure._id}`;
          measures[id] = measure;
          sensor.measures.push(id);
        }
      }

      state.sensors = sensors;
      state.measures = measures;
    },
  },
  selectors: {
    getStatsSensors: (state) => state.sensors,
    getStatsMeasures: (state) => state.measures,
  },
});

const local = {
  setValues: statsSlice.actions.setValues,
  getStatsSensors: statsSlice.selectors.getStatsSensors,
  getStatsMeasures: statsSlice.selectors.getStatsMeasures,
};

export const fetchValues = createAsyncThunk('stats/fetchValues', async ({ type, timestamp, sensors }: { type: StatsType; timestamp: Date; sensors: string[] }, api) => {
  const values = (await api.extra.call({
    service: 'stats',
    method: 'getValues',
    type,
    timestamp,
    sensors,
    timeout: 60000, // can be slower for now as we request long db queries
  })) as SetValues;

  api.dispatch(local.setValues(values));
});

export const getChartData = createSelector([local.getStatsMeasures], (measures) => {
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
});

export const getSensors = createSelector([getDevicesView, local.getStatsSensors], (devices, sensors) => {
  const deviceDisplay = new Map(Object.values(devices).map((device) => [device.deviceId, device.display]));
  const array: UiSensor[] = Object.values(sensors).map((sensor) => ({ ...sensor, display: deviceDisplay.get(sensor._id) }));
  array.sort((a, b) => (a.display < b.display ? 1 : -1));
  return array;
});

export default statsSlice.reducer;
