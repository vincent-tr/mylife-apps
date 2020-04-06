import MovingDataset from './moving-dataset';
import Position, { PositionOrder, PositionDirection } from './position';
import Instrument from './instrument';
import Market from './market';

export interface Credentials {
  key: string;
  identifier: string;
  password: string;
  isDemo: boolean;
}

export enum Resolution {
  M1 = 'm1',
  M5 = 'm5',
  H1 = 'h1'
}

export interface OpenPositionBound {
  level?: number,
  distance?: number;
}

export interface PositionSummary {
  instrumentId: string;
  dealId: string;
  openDate: Date;
  closeDate: Date;
  openLevel: number;
  closeLevel: number;
  size: number;
  profitAndLoss: number;
  currency: string;
  orders: PositionOrder[];
}

export interface Broker {
  getMarket(instrumentId: string): Market;
  fireAsync(target: () => Promise<void>): void;
  init(credentials: Credentials): Promise<void>;
  terminate(): Promise<void>;

  getInstrument(instrumentId: string): Promise<Instrument>;
  getDataset(instrumentId: string, resolution: Resolution, size: number): Promise<MovingDataset>;
  openPosition(instrument: Instrument, direction: PositionDirection, size: number, stopLoss: OpenPositionBound, takeProfit: OpenPositionBound): Promise<Position>;
  getPositionSummary(position: Position): Promise<PositionSummary>;
}