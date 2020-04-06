import { Broker } from './broker';
import { IgBroker } from './ig/broker';
import { BacktestBroker } from './backtest/broker';

export * from './broker';
export * from './instrument';
export * from './moving-dataset';
export * from './position';
export * from './market';

export { default as MovingDataset} from './moving-dataset';
export { default as Instrument} from './instrument';
export { default as Position} from './position';
export { default as Market} from './market';

type BrokerClass = { new(): Broker; };

const brokers = new Map<string, BrokerClass>();
brokers.set('ig', IgBroker);
brokers.set('backtest', BacktestBroker);

export function createBroker(implementation: string) {
  const Class = brokers.get(implementation);
  if(!implementation) {
    throw new Error(`Unknown implementation: '${implementation}'`);
  }

  return new Class();
}