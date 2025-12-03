import { Measure } from './measure';
import { Sensor } from './sensor';

export enum StatsType {
  Day = 1,
  Month,
  Year,
}

export type StatValue = {
  sensor: Sensor;
  measures: Measure[];
};
