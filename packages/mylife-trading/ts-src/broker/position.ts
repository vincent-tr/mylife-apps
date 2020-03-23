import { createLogger } from 'mylife-tools-server';
import EventEmitter from 'events';
import { StreamSubscription } from './ig/stream';
import Client from './ig/client';
import { UpdatePositionOrder, DealConfirmation, DealDirection, DealStatus, OpenPositionUpdate, UpdatePositionStatus } from './ig/dealing';
import { ConfirmationError } from './confirmation';
import { parseTimestamp } from './parsing';

const logger = createLogger('mylife:trading:broker:position');

declare interface Position {
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'update', listener: () => void): this;
  on(event: 'close', listener: () => void): this;
}

class Position extends EventEmitter {
  public readonly dealReference: string;
  public readonly dealId: string;
  public readonly direction: DealDirection;
  public readonly epic: string;

  private _stopLoss: number;
  private _takeProfit: number;
  private _lastUpdateDate: Date;

  private readonly errorCb: (err: Error) => void = (err) => this.onError(err);
  private readonly updateCb: (data: any) => void = (data) => this.onUpdate(data);

  constructor(private readonly client: Client, private readonly subscription: StreamSubscription, confirmation: DealConfirmation) {
    super();

    this.subscription.on('error', this.errorCb);
    this.subscription.on('update', this.updateCb);

    this.dealReference = confirmation.dealReference;
    this.dealId = confirmation.dealId;
    this.direction = confirmation.direction;
    this.epic = confirmation.epic;

    this.readConfirmation(confirmation);

    logger.debug(`Created: '${JSON.stringify(this)}'`);
  }

  private readConfirmation(confirmation: DealConfirmation) {
    this._stopLoss = confirmation.stopLevel;
    this._takeProfit = confirmation.limitLevel;
    this._lastUpdateDate = parseTimestamp(confirmation.date);
  }

  public get stopLoss() {
    return this._stopLoss;
  }

  public get takeProfit() {
    return this._takeProfit;
  }

  public get lastUpdateDate() {
    return this._lastUpdateDate;
  }

  async updateTakeProfit(value: number) {
    await this.updatePosition({ limitLevel: value });
  }

  async updateStopLoss(value: number) {
    await this.updatePosition({ stopLevel: value });
  }

  private async updatePosition(order: UpdatePositionOrder) {
    if (!order.stopLevel) {
      order.stopLevel = this._stopLoss;
    }
    if (!order.limitLevel) {
      order.limitLevel = this._takeProfit;
    }

    const dealReference = await this.client.dealing.updatePosition(this.dealId, order);
    const confirmation = await this.client.dealing.confirm(dealReference);

    if (confirmation.dealStatus == DealStatus.REJECTED) {
      throw new ConfirmationError(confirmation.reason);
    }

    this.readConfirmation(confirmation);
  }

  async close() {
    await this.client.dealing.closePosition(this.dealId);
  }

  private onError(err: Error) {
    this.emit('error', err);
  }

  private onUpdate(data: any) {
    const opu = data.OPU as OpenPositionUpdate;
    if (!opu) {
      return;
    }

    if (opu.dealIdOrigin !== this.dealId) {
      return;
    }

    if (opu.dealStatus === DealStatus.REJECTED) {
      return;
    }

    this._lastUpdateDate = parseTimestamp(opu.timestamp);

    switch (opu.status) {
      case UpdatePositionStatus.UPDATED:
        // should be already updated with confirmation
        this._stopLoss = opu.stopLevel;
        this._takeProfit = opu.limitLevel;
        
        logger.debug(`Updated: '${JSON.stringify(this)}'`);
        this.emit('update');
        break;

      case UpdatePositionStatus.DELETED:
        // TODO: can we get profit data ?
        this.onClose();
        break;
    }
  }

  private onClose() {
    this.subscription.removeListener('error', this.errorCb);
    this.subscription.removeListener('update', this.errorCb);

    logger.debug(`Closed: '${JSON.stringify(this)}'`);
    this.emit('close');
  }
}

export default Position;
