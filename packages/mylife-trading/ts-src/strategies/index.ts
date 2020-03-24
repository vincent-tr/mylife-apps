import Strategy from './strategy';
import ForexScalpingM1Extreme from './forex-scalping-m1-extreme';

export { Strategy };

type StrategyClass = { new(): Strategy; };

const strategies = new Map<string, StrategyClass>();
strategies.set('forex-scalping-m1-extreme', ForexScalpingM1Extreme);

export function createStrategy(implementation: string) {
  const Class = strategies.get(implementation);
  if(!implementation) {
    throw new Error(`Unknown implementation: '${implementation}'`);
  }

  return new Class();
}
