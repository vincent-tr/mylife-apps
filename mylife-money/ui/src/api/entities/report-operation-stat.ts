import { api } from 'mylife-tools';

/** Statistique d'opération */
export interface ReportOperationStat extends api.Entity {
  _entity: 'report-operation-stat';
  /** Code de la statistique */
  code: string;
  /** Valeur */
  value: any;
}
