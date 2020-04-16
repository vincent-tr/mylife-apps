import Strategy, { StrategyConfiguration, Listeners } from './strategy';
import ForexScalpingM1Extreme from './forex-scalping-m1-extreme';
import ForexScalpingM1ExtremeStochastic from './forex-scalping-m1-extreme-stochastic';

export { Strategy, StrategyConfiguration, Listeners };

type StrategyClass = { new(): Strategy; };

const strategies = new Map<string, StrategyClass>();
strategies.set('forex-scalping-m1-extreme', ForexScalpingM1Extreme);
strategies.set('forex-scalping-m1-extreme-stochastic', ForexScalpingM1ExtremeStochastic);

export function createStrategy(implementation: string) {
  const Class = strategies.get(implementation);
  if(!implementation) {
    throw new Error(`Unknown implementation: '${implementation}'`);
  }

  return new Class();
}
