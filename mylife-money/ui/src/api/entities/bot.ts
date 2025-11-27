import { api } from 'mylife-tools';

export type BotType = 'cic-scraper' | 'frais-scraper' | 'amazon-scraper' | 'paypal-scraper';

export type BotRunResult = 'success' | 'warning' | 'error';

export type BotRunLogSeverity = 'debug' | 'info' | 'warning' | 'error' | 'fatal';

/** Log d'exécution de robot */
export interface BotRunLog {
  /** Date du log */
  date: Date;
  /** Sévérité */
  severity: BotRunLogSeverity;
  /** Message */
  message: string;
}

/** Exécution de robot */
export interface BotRun {
  /** Début d'exécution */
  start: Date;
  /** Fin d'exécution */
  end: Date | null;
  /** Résultat */
  result: BotRunResult | null;
  /** Logs */
  logs: BotRunLog[];
}

/** Robot */
export interface Bot extends api.Entity {
  _entity: 'bot';
  /** Type de robot */
  type: BotType;
  /** Planification (expression cron) */
  schedule: string | null;
  /** Dernière exécution */
  lastRun: BotRun | null;
}
