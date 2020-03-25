import { Credentials } from '../broker';

export interface Configuration {
  name: string;
  implementation: string;
  epic: string;
  risk: number;
}

export default interface Strategy {
  init(configuration: Configuration, credentials: Credentials, statusListener?: (status: string) => void): Promise<void>;
  terminate(): Promise<void>;
}
