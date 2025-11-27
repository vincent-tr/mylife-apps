import { api } from 'mylife-tools';

/** Données de groupe par période */
export interface GroupData {
  /** Montant */
  amount: number;
  /** Enfants (map groupe -> données) */
  children: Record<string, GroupData>;
}

/** Rapport de groupement par période */
export interface ReportGroupByPeriod extends api.Entity {
  _entity: 'report-group-by-period';
  /** Période */
  period: string;
  /** Groupes (map groupe -> données) */
  groups: Record<string, GroupData>;
}
