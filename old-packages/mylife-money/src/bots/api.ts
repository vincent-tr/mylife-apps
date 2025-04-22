export type BotLogSeverity = 'debug' | 'info' | 'warning' | 'error' | 'fatal';

export type Bot = (context: BotExecutionContext) => Promise<void>;

export interface BotExecutionContext {
  readonly configuration: any;
  readonly state: any;
  readonly signal: AbortSignal;

  setState(state: any);

  log(severity: BotLogSeverity, message: string);
}
