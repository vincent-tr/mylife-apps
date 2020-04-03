import { Broker } from './broker';
import { IgBroker } from './ig';

export * from './broker';
export * from './instrument';
export * from './moving-dataset';
export * from './position';

export { default as MovingDataset} from './moving-dataset';
export { default as Instrument} from './instrument';
export { default as Position} from './position';

type BrokerClass = { new(): Broker; };

const brokers = new Map<string, BrokerClass>();
brokers.set('ig', IgBroker);

export function createBroker(implementation: string) {
  const Class = brokers.get(implementation);
  if(!implementation) {
    throw new Error(`Unknown implementation: '${implementation}'`);
  }

  return new Class();
}