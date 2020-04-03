import EventEmitter from 'events';

export enum PositionDirection {
  BUY = 'buy',
  SELL = 'sell'
}

export enum PositionOrderType {
  OPEN = 'open',
  UPDATE = 'update',
  CLOSE = 'close'
}

export interface PositionOrder {
  date: Date,
  type: PositionOrderType,
  takeProfit?: number,
  stopLoss?: number;
};

export default interface Position extends EventEmitter {
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'update', listener: () => void): this;
  on(event: 'close', listener: () => void): this;

  readonly dealId: string;
  readonly direction: PositionDirection;
  readonly epic: string;

  readonly orders: PositionOrder[];
  readonly stopLoss: number;
  readonly takeProfit: number;
  readonly lastUpdateDate: Date;

  updateTakeProfit(value: number): Promise<void>;
  updateStopLoss(value: number): Promise<void>;
  close(): Promise<void>;
}
