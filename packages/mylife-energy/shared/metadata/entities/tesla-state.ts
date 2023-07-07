export enum TeslaMode {
	Off,
	Fast,
	Smart,
}

export enum TeslaDeviceStatus {
	Unknown,
	Online,
	Offline,
	Failure,
}

export enum TeslaChargingStatus {
	Unknown,
	Charging,
	Complete,
	NotAtHome,
	NotPlugged,
	NoPower,  // mode smart only
	Disabled, // mode off
}

export interface TeslaState {
	_id: string;
	mode: TeslaMode;
	lastUpdate: Date;
	wallConnectorStatus: TeslaDeviceStatus;
	carStatus: TeslaDeviceStatus;
	chargingStatus: TeslaChargingStatus;
	chargingCurrent: number; // Actual current (A)
	chargingPower: number; // Actual charger power (kW)
	batteryLastTimestamp: Date; // Last time we could check battery level
	batteryLevel: number; // Actual battery level (%)
	batteryTargetLevel: number; // Target battery level (%)
}
