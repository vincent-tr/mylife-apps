import { api } from 'mylife-tools';

// UPS status flags as defined in APC UPS Status Byte
export enum UpsmonStatusFlag {
  Calibration = 0x00000001,
  Trim = 0x00000002,
  Boost = 0x00000004,
  Online = 0x00000008,
  Onbatt = 0x00000010,
  Overload = 0x00000020,
  Battlow = 0x00000040,
  Replacebatt = 0x00000080,
  Commlost = 0x00000100,
  Shutdown = 0x00000200,
  Slave = 0x00000400,
  Slavedown = 0x00000800,
  OnbattMsg = 0x00020000,
  Fastpoll = 0x00040000,
  ShutLoad = 0x00080000,
  ShutBtime = 0x00100000,
  ShutLtime = 0x00200000,
  ShutEmerg = 0x00400000,
  ShutRemote = 0x00800000,
  Plugged = 0x01000000,
  Battpresent = 0x04000000,
}

/** Statut Upsmon */
export interface UpsmonStatus extends api.Entity {
  _entity: 'upsmon-status';
  /** Date et heure auxquels les informations ont été obtenus de l'onduleur */
  date: Date;
  /** Nom de l'onduleur */
  upsName: string;
  /** Date/heure de démarrage de l'onduleur */
  startTime: Date;
  /** Modèle de l'onduleur */
  model: string;
  /** Statut de l'onduleur */
  status: string;
  /** Statut de l'onduleur (flags) */
  statusFlag: UpsmonStatusFlag;
  /** Tension courante d'entrée */
  lineVoltage: number;
  /** Pourcentage de puissance utilisée */
  loadPercent: number;
  /** Pourcentage de charge des batteries */
  batteryChargePercent: number;
  /** Temps restant en secondes d'exécution sur batteries */
  timeLeft: number;
  /** Tension des batteries */
  batteryVoltage: number;
  /** Raison du dernier transfert vers les batteries */
  lastTransfer: string;
  /** Nombre de transferts depuis le démarrage de upsmon */
  numberTransfers: number;
  /** Date/heure du dernier transfert vers les batteries */
  xOnBattery: Date;
  /** Temps sur batterie (en secondes) */
  timeOnBattery: number;
  /** Temps cumulé sur batterie depuis le démarrage de upsmon (en secondes) */
  cumulativeTimeOnBattery: number;
  /** Date/heure du dernier transfert depuis les batteries */
  xOffBattery: Date;
  /** Tension d'entrée attendue par l'onduleur */
  nominalInputVoltage: number;
  /** Tension nominale de batterie */
  nominalBatteryVoltage: number;
  /** Puissance nominale */
  nominalPower: number;
  /** Version du firmware */
  firmware: string;
  /** Tension de sortie */
  outputVoltage: number;
}
