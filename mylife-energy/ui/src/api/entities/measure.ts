import { api } from 'mylife-tools';

export interface Measure extends api.Entity {
  _entity: 'measure';
  timestamp: Date;
  sensor: string;
  value: number;
}
