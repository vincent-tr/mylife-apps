import { api } from 'mylife-tools';

export type DeviceType = 'node' | 'group' | 'main' | 'solar' | 'total';

export interface Device extends api.Entity {
  _entity: 'device';
  deviceId: string;
  display: string;
  type: DeviceType;
  computed: boolean;
  parent: string;
}
