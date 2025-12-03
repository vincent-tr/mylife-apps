import { Sensor } from '../api';

export interface SensorData extends Sensor {
  measures: string[];
}

export type UiSensor = Sensor & { display: string };

export interface TimestampData {
  timestamp: Date;
  measures: { [sensorId: string]: number };
}
