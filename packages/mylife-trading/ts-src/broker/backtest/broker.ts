import { createLogger } from 'mylife-tools-server';

import { Resolution, Credentials, Broker, PositionSummary, OpenPositionBound, BrokerConfiguration } from '../broker';
import MovingDataset, { Record, CandleStickData } from '../moving-dataset';
import Position, { PositionDirection } from '../position';
import Instrument from '../instrument';
import Market from '../market';

import BacktestMarket from './market';
import BacktestInstrument from './instrument';
import BacktestPosition from './position';
import Engine from './engine';

import { PIP } from '../../utils';

const logger = createLogger('mylife:trading:broker:backtest');

export class BacktestBroker implements Broker {
  private readonly engine: Engine;
  private readonly openedDatasets = new Set<MovingDataset>();
  private readonly openedPositions = new Set<BacktestPosition>();

  constructor(configuration: BrokerConfiguration) {
    this.engine = new Engine(configuration.testSettings);
    this.engine.on('nextData', (record) => this.emitData(record));
    // TODO: report end
    //this.engine.on('end', () => )
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
    // TODO
  }

  async terminate() {
    // TODO
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
    // for now, fill it with current data
    for (let i = size; i > 0; --i) {
      const { currentRecord } = this.engine;
      const record = new Record(currentRecord.ask, currentRecord.bid, this.engine.timeline.prevTick(i));
      dataset.add(record);
    }

    return dataset;
  }

  private emitData(record: Record) {
    for (const dataset of this.openedDatasets) {
      dataset.add(record);
    }
    for (const position of this.openedPositions) {
      position.tick(record);
    }
  }

  async openPosition(instrument: Instrument, direction: PositionDirection, size: number, stopLoss: OpenPositionBound, takeProfit: OpenPositionBound): Promise<Position> {
    if (instrument.instrumentId !== this.engine.configuration.instrumentId) {
      throw new Error(`Only configuration instrument '${this.engine.configuration.instrumentId}' supported`);
    }

    const { currentRecord } = this.engine;
    const stopLossValue = computeBound(currentRecord, stopLoss, direction, false);
    const takeProfitValue = computeBound(currentRecord, takeProfit, direction, true);

    const position = new BacktestPosition(this.engine, instrument, direction, size, stopLossValue, takeProfitValue);
    this.openedPositions.add(position);
    position.on('close', () => this.openedPositions.delete(position));

    return position;
  }

  async getPositionSummary(position: Position): Promise<PositionSummary> {
    const btPosition = position as BacktestPosition;

    return {
      instrumentId: btPosition.instrumentId,
      dealId: btPosition.dealId,
      openDate: btPosition.openDate,
      closeDate: btPosition.closeDate,
      openLevel: btPosition.openLevel,
      closeLevel: btPosition.closeLevel,
      size: btPosition.size,
      profitAndLoss: computeProfitAndLoss(btPosition),
      currency: 'E',
      orders: btPosition.orders
    };
  }
}

function parseInstrumentId(instrumentId: string) {
  const [market, instrument] = instrumentId.split(':');
  if (!market || !instrument) {
    throw new Error(`Malformed instrument id: '${instrumentId}'`);
  }
  return { market, instrument };
}

function computeBound(currentRecord: Record, bound: OpenPositionBound, direction: PositionDirection, isTakeProfit: boolean) {
  if (bound.level) {
    return bound.level;
  }

  if (!bound.distance) {
    return null;
  }

  const baseLevel = currentRecord.average.close;
  const distance = bound.distance * PIP;

  let add: boolean;
  switch (direction) {
    case PositionDirection.BUY:
      add = isTakeProfit;
      break;

    case PositionDirection.SELL:
      add = !isTakeProfit;
      break;
  }

  return add ? baseLevel + distance : baseLevel - distance;
}

function computeProfitAndLoss(position: BacktestPosition) {
  const { instrument } = position;
  let levelDiff = position.closeLevel - position.openLevel;
  if (position.direction === PositionDirection.SELL) {
    levelDiff -= levelDiff;
  }

  const profitAndLoss = levelDiff * (position.size * instrument.contractSize);
  return profitAndLoss * instrument.exchangeRate;
}