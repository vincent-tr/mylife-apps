import EventEmitter from 'events';
import { StreamSubscription } from './ig/stream';
import Client from './ig/client';
import { UpdatePositionOrder } from './ig/dealing';

declare interface Position {
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'update', listener: () => void): this;
  on(event: 'close', listener: () => void): this;
}

class Position extends EventEmitter {
  private dealId: string;

  constructor(private readonly client: Client, private readonly subscription: StreamSubscription, private readonly dealReference: string) {
    super();
  }

  async updateTakeProfit(value: number) {
    await this.updatePosition({ limitLevel: value });
  }

  async updateStopLoss(value: number) {
    await this.updatePosition({ stopLevel: value });
  }

  private async updatePosition(order: UpdatePositionOrder) {
    if(!this.dealId) {
      throw new Error('Did not get dealId, cannot update for now');
    }
    
    await this.client.dealing.updatePosition(this.dealId, order);
  }

  async close() {
  }
}

export default Position;