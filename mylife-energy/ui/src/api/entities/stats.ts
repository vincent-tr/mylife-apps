import { Measure } from './measure';
import { Sensor } from './sensor';

export type StatValue = {
  sensor: Sensor;
  measures: Measure[];
};
