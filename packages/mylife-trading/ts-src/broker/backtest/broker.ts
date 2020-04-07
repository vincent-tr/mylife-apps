import { createLogger } from 'mylife-tools-server';

import { Resolution, Credentials, Broker, PositionSummary, OpenPositionBound } from '../broker';
import MovingDataset, { Record, CandleStickData } from '../moving-dataset';
import Position, { PositionDirection } from '../position';
import Instrument from '../instrument';
import Market from '../market';
import { Timeline } from './timeline';
import BacktestMarket from './market';
import BacktestInstrument from './instrument';
import { PIP } from '../../utils';
import { HistoricalDataItem } from './cursor';

const logger = createLogger('mylife:trading:broker:backtest');

interface Configuration {
  readonly instrumentId: string;
  readonly resolution: Resolution;
  readonly spread: number;
}

export class BacktestBroker implements Broker {
  private configuration: Configuration;
  private timeline: Timeline;
  private readonly pendingPromises = new Set<Promise<void>>();
  private readonly openedDatasets = new Set<MovingDataset>();

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
    // TODO
    this.configuration = {
      instrumentId: 'forex:eurusd',
      resolution: Resolution.M1,
      spread: 1 * PIP
    };

    throw new Error('Method not implemented.');
  }

  async terminate() {
    throw new Error('Method not implemented.');
  }

  async getInstrument(instrumentId: string): Promise<Instrument> {
    return new BacktestInstrument(instrumentId);
  }

  async getDataset(instrumentId: string, resolution: Resolution, size: number): Promise<MovingDataset> {
    if (instrumentId !== this.configuration.instrumentId) {
      throw new Error(`Only configuration instrument '${this.configuration.instrumentId}' supported`);
    }

    // TODO: greater resolution (aggregate historical data items)
    if (resolution !== this.configuration.resolution) {
      throw new Error(`Only configuration resolution '${this.configuration.resolution}' supported for now`);
    }

    const dataset = new MovingDataset(size);
    this.openedDatasets.add(dataset);
    dataset.on('close', () => this.openedDatasets.delete(dataset));

    // TODO: fill it with prev data

    return dataset;
  }

  private emitData(item: HistoricalDataItem) {
    const record = createRecord(item, this.configuration.spread);
    for (const dataset of this.openedDatasets) {
      dataset.add(record);
    }
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

function createDeferred<T>(): Deferred<T> {
  let resolve: (value: T) => void;
  let reject: (err: Error) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

function createRecord(item: HistoricalDataItem, spread: number) {
  // spread = ask - bid, let's consider half above/half below
  const diff = spread / 2;
  const ask = createCandleStick(item, diff);
  const bid = createCandleStick(item, -diff);

  const record = new Record(ask, bid, item.date);
  record.fix();
  return record;
}

function createCandleStick(item: HistoricalDataItem, diff: number) {
  return new CandleStickData(item.open + diff, item.close + diff, item.high + diff, item.low + diff);
}

