export type DeviceType = 'node' | 'group' | 'main' | 'solar' | 'total'

export interface Device {
	_id: string;
	deviceId: string;
	display: string;
	type: DeviceType;
	computed: boolean;
  parent: string;
}
