import { api } from 'mylife-tools';

/** Groupe d'hôtes nagios */
export interface NagiosHostGroup extends api.Entity {
  _entity: 'nagios-host-group';
  /** Code */
  code: string;
  /** Affichage */
  display: string;
}
