import { api } from 'mylife-tools';

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
  NotPlugged,
  NoPower, // mode smart only
  Disabled, // mode off
}

export interface TeslaState extends api.Entity {
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
