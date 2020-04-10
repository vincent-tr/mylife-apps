import EventEmitter from 'events';

import Position, { PositionOrder, PositionOrderType, PositionDirection } from '../position';
import { Record } from '../moving-dataset';

import { Timeline } from './timeline';


export default class BacktestPosition extends EventEmitter implements Position {
  public readonly dealId = randomString();

  private readonly _orders: PositionOrder[] = [];
  private _stopLoss: number;
  private _takeProfit: number;
  private _lastUpdateDate: Date;

  constructor(private readonly timeline: Timeline, readonly instrumentId: string, readonly direction: PositionDirection) {
    super();

    // TODO: init stopLoss, takeProfit

    this.newOrder(PositionOrderType.OPEN);
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

  public get orders() {
    return this._orders;
  }

  toJSON() {
    return {
      dealId: this.dealId,
      direction: this.direction,
      instrumentId: this.instrumentId,
      stopLoss: this.stopLoss,
      takeProfit: this.takeProfit,
      lastUpdateDate: this.lastUpdateDate
    };
  }

  async updateTakeProfit(value: number) {
    this._takeProfit = value;
    this.newOrder(PositionOrderType.UPDATE);
  }

  async updateStopLoss(value: number) {
    this._stopLoss = value;
    this.newOrder(PositionOrderType.UPDATE);
  }

  async close() {
    // TODO
    throw new Error('Method not implemented.');
  }

  tick(record: Record) {
    // TODO
  }

  private newOrder(type: PositionOrderType) {
    this._lastUpdateDate = this.timeline.current;

    this._orders.push({
      date: this._lastUpdateDate,
      type,
      takeProfit: this._takeProfit,
      stopLoss: this._stopLoss
    });

    this.checkClose();
  }

  private checkClose() {
    // TODO
  }
}

function randomString() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
