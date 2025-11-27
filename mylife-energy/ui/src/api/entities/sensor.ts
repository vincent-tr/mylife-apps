import { api } from 'mylife-tools';

export interface Sensor extends api.Entity {
  _entity: 'sensor';
  sensorId: string;
  deviceClass: string;
  stateClass: string;
  unitOfMeasurement: string;
  accuracyDecimals: number;
}
