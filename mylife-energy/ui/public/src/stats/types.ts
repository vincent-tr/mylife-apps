import { Sensor } from '../../../shared/metadata';

export enum StatsType {
  Day = 1,
  Month,
  Year,
};

export interface SensorData extends Sensor {
  measures: string[];
}

export type UiSensor = Sensor & { display: string };

export interface TimestampData {
  timestamp: Date;
  measures: { [sensorId: string]: number };
}
