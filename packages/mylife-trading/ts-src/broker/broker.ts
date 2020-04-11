import EventEmitter from 'events';
import MovingDataset from './moving-dataset';
import Position, { PositionOrder, PositionDirection } from './position';
import Instrument from './instrument';
import Market from './market';

export enum Resolution {
  M1 = 'm1',
  M5 = 'm5',
  H1 = 'h1'
}

export enum BrokerConfigurationType {
  BACKTEST = 'backtest',
  IG_REAL = 'ig-real',
  IG_DEMO = 'ig-demo'
}

export interface Credentials {
  readonly key: string;
  readonly identifier: string;
  readonly password: string;
}

export interface TestSettings {
  readonly instrumentId: string;
  readonly resolution: Resolution;
  readonly spread: number;
}

export interface BrokerConfiguration {
  readonly type: BrokerConfigurationType;
  readonly credentials: Credentials;
  readonly testSettings: TestSettings;
}

export interface OpenPositionBound {
  readonly level?: number,
  readonly distance?: number;
}

export interface PositionSummary {
  readonly instrumentId: string;
  readonly dealId: string;
  readonly openDate: Date;
  readonly closeDate: Date;
  readonly openLevel: number;
  readonly closeLevel: number;
  readonly size: number;
  readonly profitAndLoss: number;
  readonly currency: string;
  readonly orders: PositionOrder[];
}

export interface Broker extends EventEmitter {

  on(event: 'error', listener: (err: Error) => void): this;

  getMarket(instrumentId: string): Promise<Market>;
  fireAsync(target: () => Promise<void>): void;
  init(): Promise<void>;
  terminate(): Promise<void>;

  getInstrument(instrumentId: string): Promise<Instrument>;
  getDataset(instrumentId: string, resolution: Resolution, size: number): Promise<MovingDataset>;
  openPosition(instrument: Instrument, direction: PositionDirection, size: number, stopLoss: OpenPositionBound, takeProfit: OpenPositionBound): Promise<Position>;
  getPositionSummary(position: Position): Promise<PositionSummary>;
}
