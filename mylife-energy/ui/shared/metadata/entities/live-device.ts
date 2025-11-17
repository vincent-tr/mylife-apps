import { views } from 'mylife-tools-ui';
import { DeviceType } from './device';

export interface LiveDevice extends views.Entity {
	display: string
	type: DeviceType
	computed: boolean
	sensors: LiveSensor[]
}

export interface LiveSensor {
	key: string
	display: string
	deviceClass: string
	stateClass: string
	unitOfMeasurement: string
	accuracyDecimals: number
}
