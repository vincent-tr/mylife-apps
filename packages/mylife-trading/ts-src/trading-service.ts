import { registerService } from 'mylife-tools-server';
import { Strategy, StrategyConfiguration, Listeners, createStrategy } from './strategies';
import { Mutex } from 'async-mutex';

export class TradingService {
  static readonly serviceName = 'trading-service';
  private readonly strategies = new Map<string, Strategy>();
  private readonly mutex = new Mutex();

  async add(key: string, configuration: StrategyConfiguration, listeners: Listeners) {
    await this.mutex.runExclusive(async () => {
      if (this.strategies.get(key)) {
        throw new Error(`Strategy does already exist: '${key}'`);
      }

      const strategy = createStrategy(configuration.implementation);
      await strategy.init(configuration, listeners);
      this.strategies.set(key, strategy);
    });
  }

  async remove(key: string) {
    await this.mutex.runExclusive(async () => {
      const strategy = this.strategies.get(key);
      if (!strategy) {
        throw new Error(`Strategy does not exist: '${key}'`);
      }

      await strategy.terminate();
      this.strategies.delete(key);
    });
  }

  async init(options: any) {
  }

  async terminate() {
    await this.mutex.runExclusive(async () => {
      for (const strategy of this.strategies.values()) {
        await strategy.terminate();
      }
      this.strategies.clear();
    });
  }
}

registerService(TradingService);
