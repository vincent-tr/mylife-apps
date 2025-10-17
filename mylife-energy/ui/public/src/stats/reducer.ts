import { Action, handleActions, routing } from 'mylife-tools-ui';
import actionTypes, { SensorData, SetValues, StatsState } from './types';
import { Sensor, Measure } from '../../../shared/metadata';

const initialState: StatsState = {
  sensors: {},
  measures: {},
};

export default handleActions({

  [actionTypes.SET_VALUES] : (state, action: Action<SetValues>) => ({
    ...state,
    ...buildValues(action.payload),
  }),

}, initialState);

function buildValues(source: SetValues) {
  const sensors: { [id: string]: SensorData } = {};
  const measures: { [id: string]: Measure } = {};

  for (const item of source) {
    const sensor: SensorData = { ...item.sensor, measures: [] };
    sensors[sensor._id] = sensor;

    const measuresList = item.measures.slice();
    measuresList.sort((a, b) => (a.timestamp.valueOf() - b.timestamp.valueOf()))

    for (const measure of measuresList) {
      // make a reducer-wide unique id
      const id = `${sensor._id}:${measure._id}`;
      measures[id] = measure;
      sensor.measures.push(id);
    }
  }

  return { sensors, measures };
}