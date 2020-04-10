import EventEmitter from 'events';

import Position, { PositionOrder, PositionOrderType, PositionDirection } from '../position';
import { Record } from '../moving-dataset';

import Engine from './engine';
import BacktestInstrument from './instrument';


export default class BacktestPosition extends EventEmitter implements Position {
  readonly dealId = randomString();

  private readonly _orders: PositionOrder[] = [];
  private _stopLoss: number;
  private _takeProfit: number;
  private _lastUpdateDate: Date;
  readonly openDate: Date;
  readonly openLevel: number;
  private _closeDate: Date;
  private _closeLevel: number;

  constructor(private readonly engine: Engine, readonly instrument: BacktestInstrument, readonly direction: PositionDirection, readonly size: number, stopLoss: number, takeProfit: number) {
    super();

    this._stopLoss = stopLoss;
    this._takeProfit = takeProfit;

    this.newOrder(PositionOrderType.OPEN);

    const { currentRecord } = this.engine;
    this.openDate = currentRecord.timestamp;
    this.openLevel = currentRecord.average.close;
  }

  get instrumentId() {
    return this.instrument.instrumentId;
  }

  get orders() {
    return this._orders;
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

  get closeDate() {
    return this._closeDate;
  }

  get closeLevel() {
    return this._closeLevel;
  }

  toJSON() {
    return {
      dealId: this.dealId,
      direction: this.direction,
      instrumentId: this.instrument.instrumentId,
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

  private newOrder(type: PositionOrderType) {
    this._lastUpdateDate = this.engine.timeline.current;

    this._orders.push({
      date: this._lastUpdateDate,
      type,
      takeProfit: this._takeProfit,
      stopLoss: this._stopLoss
    });

    this.checkClose();
  }

  async close() {
    // TODO
    throw new Error('Method not implemented.');
  }

  tick(record: Record) {
    // TODO
  }

  private closeImpl() {
    // TODO
    const { currentRecord } = this.engine;
    this._closeDate = currentRecord.timestamp;
    this._closeLevel = currentRecord.average.close;
  }

  private checkClose() {
    // TODO
  }
}

function randomString() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
