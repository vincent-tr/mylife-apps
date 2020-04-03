import { Broker } from './broker';
import { IgBroker } from './ig';

export { Broker };

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