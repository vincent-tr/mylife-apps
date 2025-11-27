import { api } from 'mylife-tools';

export enum TeslaMode {
  Off = 0,
  Fast = 1,
  Smart = 2,
}

export enum TeslaDeviceStatus {
  Unknown = 0,
  Online = 1,
  Offline = 2,
  Failure = 3,
}

export enum TeslaChargingStatus {
  Unknown = 0,
  Charging = 1,
  Complete = 2,
  NotPlugged = 3,
  NoPower = 4, // mode smart only
  Disabled = 5, // mode off
}

export interface TeslaState extends api.Entity {
  _entity: 'tesla-state';
  mode: TeslaMode; // Current charging mode
  fastLimit: number; // Fast mode charge limit (%)
  smartLimitLow: number; // Smart mode charge low limit (%)
  smartLimitHigh: number; // Smart mode charge high limit (%)
  smartFastCurrent: number; // Smart mode fast charge current (A)
  lastUpdate: Date;
  wallConnectorStatus: TeslaDeviceStatus;
  carStatus: TeslaDeviceStatus;
  chargingStatus: TeslaChargingStatus;
  chargingCurrent: number; // Actual current (A)
  chargingPower: number; // Actual charger power (kW)
  chargingTimeLeft: number; // Time left for full charge (Minutes)
  batteryLastTimestamp: Date; // Last time we could check battery level
  batteryLevel: number; // Actual battery level (%)
  batteryTargetLevel: number; // Target battery level (%)
}
