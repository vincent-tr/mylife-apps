import { registerService } from 'mylife-tools-server';
import { Strategy, createStrategy } from './strategies';

class TradingService {
  static readonly serviceName = 'trading-service';
  static readonly dependencies = ['store'];
  private bot: Strategy;

  async init(options: any) {
    this.bot = createStrategy('forex-scalping-m1-extreme');
    await this.bot.init();
  }

  async terminate() {
    await this.bot.terminate();
    this.bot = null;
  }
}

registerService(TradingService);
