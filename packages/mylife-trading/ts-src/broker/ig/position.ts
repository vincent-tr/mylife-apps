import EventEmitter from 'events';
import { createLogger } from 'mylife-tools-server';
import { StreamSubscription } from './api/stream';
import Client from './api/client';
import { UpdatePositionOrder, DealConfirmation, DealStatus, OpenPositionUpdate, UpdatePositionStatus, ClosePositionOrder, OrderType } from './api/dealing';
import { ConfirmationError, ConfirmationListener } from './confirmation';
import { parseTimestamp, parseDirection, serializeDirection } from './parsing';
import Position, { PositionOrder, PositionOrderType, PositionDirection } from '../position';

const logger = createLogger('mylife:trading:broker:position:ig');

export default class IgPosition extends EventEmitter implements Position {
  readonly dealReference: string;
  readonly dealId: string;
  readonly direction: PositionDirection;
  private readonly size: number; // needed for close

  private readonly _orders: PositionOrder[] = [];
  private _stopLoss: number;
  private _takeProfit: number;
  private _lastUpdateDate: Date;

  private readonly errorCb: (err: Error) => void = (err) => this.onError(err);
  private readonly updateCb: (data: any) => void = (data) => this.onUpdate(data);

  constructor(private readonly client: Client, private readonly subscription: StreamSubscription, confirmation: DealConfirmation, readonly instrumentId: string) {
    super();

    this.subscription.on('error', this.errorCb);
    this.subscription.on('update', this.updateCb);

    this.dealReference = confirmation.dealReference;
    this.dealId = confirmation.dealId;
    this.direction = parseDirection(confirmation.direction);
    this.size = confirmation.size;

    this.readConfirmation(confirmation, PositionOrderType.OPEN);

    logger.debug(`Created: '${JSON.stringify(this)}'`);
  }

  private readConfirmation(confirmation: DealConfirmation, type: PositionOrderType) {
    this._stopLoss = confirmation.stopLevel;
    this._takeProfit = confirmation.limitLevel;
    this._lastUpdateDate = parseTimestamp(confirmation.date);

    this._orders.push({
      date: this._lastUpdateDate,
      type,
      takeProfit: this._takeProfit,
      stopLoss: this._stopLoss
    });
  }

  get stopLoss() {
    return this._stopLoss;
  }

  get takeProfit() {
    return this._takeProfit;
  }

  get lastUpdateDate() {
    return this._lastUpdateDate;
  }

  get orders() {
    return this._orders;
  }

  toJSON() {
    return {
      dealReference: this.dealReference,
      dealId: this.dealId,
      direction: this.direction,
      instrumentId: this.instrumentId,
      stopLoss: this.stopLoss,
      takeProfit: this.takeProfit,
      lastUpdateDate: this.lastUpdateDate
    };
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

    const confirmationListener = ConfirmationListener.fromSubscription(this.subscription);
    const dealReference = await this.client.dealing.updatePosition(this.dealId, order);
    const confirmation = await confirmationListener.wait(dealReference);

    if (confirmation.dealStatus == DealStatus.REJECTED) {
      throw new ConfirmationError(confirmation.reason);
    }

    this.readConfirmation(confirmation, PositionOrderType.UPDATE);
  }

  async close() {
    const order: ClosePositionOrder = {
      dealId: this.dealId,
      direction: serializeDirection(this.direction),
      orderType: OrderType.MARKET,
      size: this.size
    };

    const confirmationListener = ConfirmationListener.fromSubscription(this.subscription);
    const dealReference = await this.client.dealing.closePosition(order);
    const confirmation = await confirmationListener.wait(dealReference);

    if (confirmation.dealStatus == DealStatus.REJECTED) {
      throw new ConfirmationError(confirmation.reason);
    }

    this._orders.push({
      date: new Date(),
      type: PositionOrderType.CLOSE,
    });
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
