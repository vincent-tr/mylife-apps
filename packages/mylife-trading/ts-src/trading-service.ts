import { registerService } from 'mylife-tools-server';
import Strategy1 from './strategy-1';
import Strategy from './strategy';

class TradingService {
  static readonly serviceName = 'trading-service';
  static readonly dependencies = ['store'];
  private bot: Strategy;

  async init(options: any) {
    this.bot = new Strategy1();
    await this.bot.init();
  }

  async terminate() {
    await this.bot.terminate();
    this.bot = null;
  }
}

registerService(TradingService);
