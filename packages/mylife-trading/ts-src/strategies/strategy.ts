import { Credentials } from '../broker';

export interface Configuration {
  name: string;
  epic: string;
  risk: number;
}

export default interface Strategy {
  init(configuration: Configuration, credentials: Credentials): Promise<void>;
  terminate(): Promise<void>;
}
