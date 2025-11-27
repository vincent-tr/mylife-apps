import { api } from 'mylife-tools';

export type NagiosHostStatus = 'pending' | 'up' | 'down' | 'unreachable';

/** Hôte nagios */
export interface NagiosHost extends api.Entity {
  _entity: 'nagios-host';
  /** Code */
  code: string;
  /** Affichage */
  display: string;
  /** Groupe - reference to NagiosHostGroup._id */
  group: string;
  /** Statut */
  status: NagiosHostStatus;
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
