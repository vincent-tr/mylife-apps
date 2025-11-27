import { api } from 'mylife-tools';
import { DeviceType } from './device';

export interface LiveDevice extends api.Entity {
  _entity: 'live-device';
  display: string;
  type: DeviceType;
  computed: boolean;
  sensors: LiveSensor[];
}

export interface LiveSensor {
  key: string;
  display: string;
  deviceClass: string;
  stateClass: string;
  unitOfMeasurement: string;
  accuracyDecimals: number;
}
