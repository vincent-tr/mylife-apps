export interface LiveDevice {
	_id: string
	display: string
	type: DeviceType
	computed: boolean
	sensors: LiveSensor[]
}

export type DeviceType = 'node' | 'group' | 'main' | 'solar' | 'total'

export interface LiveSensor {
	key: string
	display: string
	deviceClass: string
	stateClass: string
	unitOfMeasurement: string
	accuracyDecimals: number
}
