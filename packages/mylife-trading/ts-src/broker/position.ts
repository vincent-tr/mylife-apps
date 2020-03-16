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
  private readonly errorCb: (err: Error) => void = (err) => this.onError(err);
  private readonly updateCb: (data: any) => void = (data) => this.onUpdate(data);

  constructor(private readonly client: Client, private readonly subscription: StreamSubscription, private readonly dealReference: string) {
    super();

    this.subscription.on('error', this.errorCb);
    this.subscription.on('update', this.updateCb);
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
    await this.client.dealing.closePosition(this.dealId);
  }

  private onError(err: Error) {
    this.emit('error', err);
  }

  private onUpdate(data: any) {
    // TODO: position data
    // TODO: position close emit
    console.log(data);
  }

  private onClose() {
    this.subscription.removeListener('error', this.errorCb);
    this.subscription.removeListener('update', this.errorCb);

    this.emit('close');
  }
}

export default Position;