import { createLogger } from 'mylife-tools-server';

import { Resolution, Credentials, Broker, PositionSummary, OpenPositionBound } from '../broker';
import MovingDataset, { Record, CandleStickData } from '../moving-dataset';
import Position, { PositionDirection } from '../position';
import Instrument from '../instrument';
import Market from '../market';
import { Timeline } from './timeline';
import BacktestMarket from './market';
import BacktestInstrument from './instrument';

const logger = createLogger('mylife:trading:broker:backtest');

export class BacktestBroker implements Broker {
  private timeline: Timeline;
  private readonly pendingPromises = new Set<Promise<void>>();

  getMarket(instrumentId: string): Market {
    const { market } = parseInstrumentId(instrumentId);
    return BacktestMarket.create(this.timeline, market);
  }

  fireAsync(target: () => Promise<void>): void {
    const deferred = createDeferred<void>();
    this.pendingPromises.add(deferred.promise);

    target().catch(err => logger.error(`Unhandled promise rejection: ${err.stack}`)).finally(() => {
      this.pendingPromises.delete(deferred.promise);
      deferred.resolve();
    });
  }

  private async waitAllAsync() {
    const pendings = Array.from(this.pendingPromises);
    return Promise.all(pendings);
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

interface Deferred<T> {
  readonly promise: Promise<T>;
  readonly resolve: (value: T) => void;
  readonly reject: (err: Error) => void;
};

function createDeferred<T>() : Deferred<T> {
  let resolve: (value: T) => void;
  let reject: (err: Error) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}