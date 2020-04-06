import { Resolution, Credentials, Broker, PositionSummary, OpenPositionBound } from '../broker';
import MovingDataset, { Record, CandleStickData } from '../moving-dataset';
import Position, { PositionDirection } from '../position';
import Instrument from '../instrument';
import Market from '../market';
import { Timeline } from './timeline';
import BacktestMarket from './market';
import BacktestInstrument from './instrument';

export class BacktestBroker implements Broker {
  private timeline: Timeline;

  getMarket(instrumentId: string): Market {
    const { market } = parseInstrumentId(instrumentId);
    return BacktestMarket.create(this.timeline, market);
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
    return new BacktestInstrument(instrumentId);
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

function parseInstrumentId(instrumentId: string) {
  const [market, instrument] = instrumentId.split(':');
  if (!market || !instrument) {
    throw new Error(`Malformed instrument id: '${instrumentId}'`);
  }
  return { market, instrument };
}