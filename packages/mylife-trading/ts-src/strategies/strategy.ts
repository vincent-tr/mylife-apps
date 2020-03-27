import { Credentials, PositionSummary } from '../broker';

export interface Configuration {
  name: string;
  implementation: string;
  epic: string;
  risk: number;
}

export interface Listeners {
  onStatusChanged: (status: string) => void;
  onNewPositionSummary: (summary: PositionSummary) => void;
  onFatalError: (error: Error) => void;
}

export default interface Strategy {
  init(configuration: Configuration, credentials: Credentials, listeners: Listeners): Promise<void>;
  terminate(): Promise<void>;
}
