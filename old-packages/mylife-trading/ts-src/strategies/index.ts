import Strategy, { StrategyConfiguration, Listeners } from './strategy';
import M1RsiBb from './m1-rsi-bb';
import M1SmaStochastic from './m1-sma-stochastic';
import M1SmaSar from './m1-sma-sar';
import M13Ema from './m1-3ema';

export { Strategy, StrategyConfiguration, Listeners };

type StrategyClass = { new(): Strategy; };

const strategies = new Map<string, StrategyClass>();
strategies.set('m1-rsi-bb', M1RsiBb);
strategies.set('m1-sma-stochastic', M1SmaStochastic);
strategies.set('m1-sma-sar', M1SmaSar);
strategies.set('m1-3ema', M13Ema);

export function createStrategy(implementation: string) {
  const Class = strategies.get(implementation);
  if(!implementation) {
    throw new Error(`Unknown implementation: '${implementation}'`);
  }

  return new Class();
}
