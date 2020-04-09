import { Broker, BrokerConfiguration, BrokerConfigurationType } from './broker';
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

type BrokerClass = { new(configuration: BrokerConfiguration): Broker; };

const brokers = new Map<BrokerConfigurationType, BrokerClass>();
brokers.set(BrokerConfigurationType.IG_DEMO, IgBroker);
brokers.set(BrokerConfigurationType.IG_REAL, IgBroker);
brokers.set(BrokerConfigurationType.BACKTEST, BacktestBroker);

export function createBroker(configuration: BrokerConfiguration) {
  const Class = brokers.get(configuration.type);
  if(!Class) {
    throw new Error(`Unknown type: '${configuration.type}'`);
  }

  return new Class(configuration);
}