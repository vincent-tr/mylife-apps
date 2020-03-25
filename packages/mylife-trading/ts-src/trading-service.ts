import { registerService } from 'mylife-tools-server';
import { Strategy, Configuration, createStrategy } from './strategies';
import { Credentials } from './broker';
import { Mutex } from 'async-mutex';

export class TradingService {
  static readonly serviceName = 'trading-service';
  static readonly dependencies = ['store'];
  private readonly strategies = new Map<string, Strategy>();
  private readonly mutex = new Mutex();

  async init(options: any) {
    const configuration = { epic: 'CS.D.EURUSD.MINI.IP', implementation: 'forex-scalping-m1-extreme', risk: 5, name: 'test' };
    const credentials = { key: process.env.IGKEY, identifier: process.env.IGID, password: process.env.IGPASS, isDemo: true };
    const statusListener = (status: string) => console.log('STATUSLISTENER', status);
    await this.add('test', configuration, credentials, statusListener);
  }

  async add(key: string, configuration: Configuration, credentials: Credentials, statusListener?: (status: string) => void) {
    await this.mutex.runExclusive(async () => {
      if (this.strategies.get(key)) {
        throw new Error(`Strategy does already exist: '${key}'`);
      }

      const strategy = createStrategy(configuration.implementation);
      await strategy.init(configuration, credentials, statusListener);
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
