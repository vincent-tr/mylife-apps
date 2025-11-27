import { api } from 'mylife-tools';

/** Résumé Upsmon */
export interface UpsmonSummary extends api.Entity {
  _entity: 'upsmon-summary';
  /** Date/heure auxquels les informations ont été obtenus de l'onduleur */
  date: Date;
  /** Nom de l'onduleur */
  upsName: string;
  /** Statut de l'onduleur */
  status: string;
}
