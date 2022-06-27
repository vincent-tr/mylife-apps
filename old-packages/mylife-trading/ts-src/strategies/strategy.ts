import { PositionSummary, BrokerConfiguration } from '../broker';

export interface StrategyConfiguration {
  readonly name: string;
  readonly implementation: string;
  readonly instrumentId: string;
  readonly risk: number;
  readonly broker: BrokerConfiguration;
}

export interface Listeners {
  onStatusChanged: (status: string) => void;
  onNewPositionSummary: (summary: PositionSummary) => void;
  onFatalError: (error: Error) => void;
}

export default interface Strategy {
  init(configuration: StrategyConfiguration, listeners: Listeners): Promise<void>;
  terminate(): Promise<void>;
}
