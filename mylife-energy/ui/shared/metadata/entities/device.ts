import { views } from 'mylife-tools-ui';

export type DeviceType = 'node' | 'group' | 'main' | 'solar' | 'total';

export interface Device extends views.Entity {
  deviceId: string;
  display: string;
  type: DeviceType;
  computed: boolean;
  parent: string;
}
