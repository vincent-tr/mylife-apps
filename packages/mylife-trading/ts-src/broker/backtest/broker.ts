import { Resolution, Credentials, Broker, PositionSummary, OpenPositionBound } from '../broker';
import MovingDataset, { Record, CandleStickData } from '../moving-dataset';
import Position, { PositionDirection } from '../position';
import Instrument from '../instrument';
import Market from '../market';

export class BacktestBroker implements Broker {
  getMarket(instrumentId: string): Market {
    throw new Error('Method not implemented.');
  }

  fireAsync(target: () => Promise<void>): void {
    throw new Error('Method not implemented.');
  }
  
  async init(credentials: Credentials) {
    throw new Error('Method not implemented.');
  }

  async terminate() {
    throw new Error('Method not implemented.');
  }
  
  async getInstrument(instrumentId: string): Promise<Instrument> {
    throw new Error('Method not implemented.');
  }

  async getDataset(instrumentId: string, resolution: Resolution, size: number): Promise<MovingDataset> {
    throw new Error('Method not implemented.');
  }

  async openPosition(instrument: Instrument, direction: PositionDirection, size: number, stopLoss: OpenPositionBound, takeProfit: OpenPositionBound): Promise<Position> {
    throw new Error('Method not implemented.');
  }

  async getPositionSummary(position: Position): Promise<PositionSummary> {
    throw new Error('Method not implemented.');
  }
}