import EventEmitter from 'events';
import { createLogger } from 'mylife-tools-server';

import { TestSettings } from '../broker';
import { Record, CandleStickData } from '../moving-dataset';

import { Timeline } from './timeline';
import Cursor, { HistoricalDataItem } from './cursor';

const logger = createLogger('mylife:trading:broker:backtest:engine');

interface Engine extends EventEmitter {
  on(event: 'nextData', listener: (item: Record) => void): this;
  on(event: 'end', listener: () => void): this;
}

class TickStream {
  private readonly end: Promise<void>;
  private closeFlag = false;

  constructor(private readonly next: () => Promise<void>) {
    this.end = this.run();
  }

  async terminate() {
    this.closeFlag = true;
    await this.end;
  }

  terminateFromInside() {
    this.closeFlag = true;
  }

  private async run() {
    while (!this.closeFlag) {
      await this.next();
    }
  }
}

class Engine extends EventEmitter implements Engine {
  private readonly spread: number;
  public readonly timeline: Timeline;
  private readonly cursor: Cursor;
  private runner: TickStream;
  private readonly pendingPromises = new Set<Promise<void>>();
  private _lastRecord: Record;

  get lastRecord() {
    return this._lastRecord;
  }

  constructor(public readonly configuration: TestSettings) {
    super();

    this.spread = configuration.spread;
    this.timeline = new Timeline(this.configuration.resolution);
    this.cursor = new Cursor(this.configuration.resolution, this.configuration.instrumentId);
  }

  async init() {
    const item = await this.cursor.next();
    const record = createRecord(item, this.spread);
    // at bootstrap, _lastRecord = item
    this._lastRecord = record;
    this.timeline.set(record.timestamp);

    this.emit('nextData', item);
    await this.waitAllAsync();

    this.runner = new TickStream(() => this.tick());
  }

  // TODO: call it
  private async tick() {
    const item = await this.cursor.next();

    if (!item) {
      this.runner.terminateFromInside();
      this.runner = null;
      this.emit('end');
      return;
    }
    const record = createRecord(item, this.spread);

    this.timeline.increment();

    if (this.timeline.current.getTime() !== record.timestamp.getTime()) {
      throw new Error(`Timeline (${this.timeline.current.toISOString()}) does not correspond to cursor (${record.timestamp.toISOString()})`);
    }

    this.emit('nextData', record);
    await this.waitAllAsync();

    this._lastRecord = record;
  }

  async terminate() {
    await this.runner.terminate();
    await this.waitAllAsync();
    await this.cursor.close();
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
    await Promise.all(pendings);
  }
}

export default Engine;

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

