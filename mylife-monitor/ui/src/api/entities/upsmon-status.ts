import { api } from 'mylife-tools';

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
  statusFlag: number;
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
