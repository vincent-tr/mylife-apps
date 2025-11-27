import { api } from 'mylife-tools';
import type { NagiosServiceStatus } from './datatypes';

/** Service nagios */
export interface NagiosService extends api.Entity {
  _entity: 'nagios-service';
  /** Code */
  code: string;
  /** Affichage */
  display: string;
  /** Hôte - reference to NagiosHost._id */
  host: string;
  /** Statut */
  status: NagiosServiceStatus;
  /** Texte du statut */
  statusText: string;
  /** Tentative courante */
  currentAttempt: number;
  /** Tentatives totales */
  maxAttempts: number;
  /** Dernier check */
  lastCheck: Date;
  /** Prochain check */
  nextCheck: Date;
  /** Dernier changement d'état */
  lastStateChange: Date;
  /** Instable */
  isFlapping: boolean;
}
