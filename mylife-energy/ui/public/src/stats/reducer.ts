import { handleActions } from 'redux-actions';
import { routing } from 'mylife-tools-ui';
import actionTypes, { SensorData, SetValues, StatsState } from './types';
import { Sensor, Measure } from '../../../shared/metadata';

type FIXME_any = any;

const initialState: StatsState = {
  sensors: {},
  measures: {},
};

export default handleActions({

  [actionTypes.SET_VALUES] : (state, action: FIXME_any/*Action<SetValues>*/) => ({
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