import { constants } from 'mylife-tools-ui';
import { Measure, Sensor } from '../../../shared/metadata';

export default constants.wrap({
  SET_VALUES : null,
}, 'stats');

export type SetValues = {
  sensor: Sensor,
  measures: Measure[],
}[];

export interface SensorData extends Sensor {
  measures: string[];
}

export interface StatsState {
  sensors: { [id: string]: SensorData },
  measures: { [id: string]: Measure },
}
