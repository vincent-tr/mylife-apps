import { api } from 'mylife-tools';
import type { NagiosObjectType } from './datatypes';

/** Résumé Nagios */
export interface NagiosSummary extends api.Entity {
  _entity: 'nagios-summary';
  /** Type d'objet */
  type: NagiosObjectType;
  /** Nombre OK */
  ok: number;
  /** Nombre de warnings */
  warnings: number;
  /** Nombre d'erreurs */
  errors: number;
}
