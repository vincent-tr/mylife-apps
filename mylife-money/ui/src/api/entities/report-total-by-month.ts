import { api } from 'mylife-tools';

/** Rapport total par mois */
export interface ReportTotalByMonth extends api.Entity {
  _entity: 'report-total-by-month';
  /** Mois (format YYYY-MM) */
  month: string;
  /** Nombre d'opérations */
  count: number;
  /** Somme des débits */
  sumDebit: number;
  /** Somme des crédits */
  sumCredit: number;
  /** Balance (total) */
  balance: number;
}
