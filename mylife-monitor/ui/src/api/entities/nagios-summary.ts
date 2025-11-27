import { api } from 'mylife-tools';

export type NagiosObjectType = 'host' | 'service';

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
