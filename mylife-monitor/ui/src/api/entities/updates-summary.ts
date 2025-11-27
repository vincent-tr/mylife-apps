import { api } from 'mylife-tools';

/** Résumé Updates */
export interface UpdatesSummary extends api.Entity {
  _entity: 'updates-summary';
  /** Catégorie */
  category: string;
  /** OK */
  ok: number;
  /** Dépassés */
  outdated: number;
  /** Inconnus */
  unknown: number;
}
