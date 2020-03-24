import { registerService } from 'mylife-tools-server';
import { Strategy, createStrategy } from './strategies';

class TradingService {
  static readonly serviceName = 'trading-service';
  static readonly dependencies = ['store'];
  private bot: Strategy;

  async init(options: any) {
    this.bot = createStrategy('forex-scalping-m1-extreme');
    const configuration = { epic: 'CS.D.EURUSD.MINI.IP', risk: 5, name: 'test' };
    const credentials = { key: process.env.IGKEY, identifier: process.env.IGID, password: process.env.IGPASS, isDemo: true };
    await this.bot.init(configuration, credentials);
  }

  async terminate() {
    await this.bot.terminate();
    this.bot = null;
  }
}

registerService(TradingService);
