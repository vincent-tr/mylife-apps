import { createLogger } from 'mylife-tools-server';

import { Resolution, Credentials, Broker, PositionSummary, OpenPositionBound, BrokerConfiguration } from '../broker';
import MovingDataset, { Record, CandleStickData } from '../moving-dataset';
import Position, { PositionDirection } from '../position';
import Instrument from '../instrument';
import Market from '../market';

import BacktestMarket from './market';
import BacktestInstrument from './instrument';
import { HistoricalDataItem } from './cursor';
import Engine from './engine';

import { PIP } from '../../utils';

const logger = createLogger('mylife:trading:broker:backtest');

export class BacktestBroker implements Broker {
  private readonly engine: Engine;
  private readonly openedDatasets = new Set<MovingDataset>();

  constructor(configuration: BrokerConfiguration) {
    // TODO
    this.engine = new Engine({
      instrumentId: 'forex:eurusd',
      resolution: Resolution.M1,
      spread: 1 * PIP
    });

    this.engine.on('nextData', (item) => this.emitData(item));
  }

  async getMarket(instrumentId: string): Promise<Market> {
    // let's consider that the market "own" the timeline: market creation init it, market close terminate it
    const { market } = parseInstrumentId(instrumentId);

    await this.engine.init();
    return BacktestMarket.create(this.engine, market, () => this.engine.terminate());
  }

  fireAsync(target: () => Promise<void>): void {
    this.engine.fireAsync(target);
  }

  async init() {
    throw new Error('Method not implemented.');
  }

  async terminate() {
    throw new Error('Method not implemented.');
  }

  async getInstrument(instrumentId: string): Promise<Instrument> {
    return new BacktestInstrument(instrumentId);
  }

  async getDataset(instrumentId: string, resolution: Resolution, size: number): Promise<MovingDataset> {
    if (instrumentId !== this.engine.configuration.instrumentId) {
      throw new Error(`Only configuration instrument '${this.engine.configuration.instrumentId}' supported`);
    }

    // TODO: greater resolution (aggregate historical data items)
    if (resolution !== this.engine.configuration.resolution) {
      throw new Error(`Only configuration resolution '${this.engine.configuration.resolution}' supported for now`);
    }

    const dataset = new MovingDataset(size);
    this.openedDatasets.add(dataset);
    dataset.on('close', () => this.openedDatasets.delete(dataset));

    // TODO: fill it with prev data

    return dataset;
  }

  private emitData(item: HistoricalDataItem) {
    const record = createRecord(item, this.engine.configuration.spread);
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

