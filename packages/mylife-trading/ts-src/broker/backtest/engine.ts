import EventEmitter from 'events';
import { createLogger } from 'mylife-tools-server';

import { TestSettings } from '../broker';
import { Timeline } from './timeline';
import Cursor, { HistoricalDataItem } from './cursor';

const logger = createLogger('mylife:trading:broker:backtest:engine');

interface Engine extends EventEmitter {
  on(event: 'nextData', listener: (item: HistoricalDataItem) => void): this;
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
  public readonly timeline: Timeline;
  private readonly cursor: Cursor;
  private runner: TickStream;
  private readonly pendingPromises = new Set<Promise<void>>();
  private _lastItem: HistoricalDataItem;

  get lastItem() {
    return this._lastItem;
  }

  constructor(public readonly configuration: TestSettings) {
    super();

    this.timeline = new Timeline(this.configuration.resolution);
    this.cursor = new Cursor(this.configuration.resolution, this.configuration.instrumentId);
  }

  async init() {
    const item = await this.cursor.next();
    // at bootstrap, _lastItem = item
    this._lastItem = item;
    this.timeline.set(item.date);

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

    this.timeline.increment();

    if (this.timeline.current.getTime() !== item.date.getTime()) {
      throw new Error(`Timeline (${this.timeline.current.toISOString()}) does not correspond to cursor (${item.date.toISOString()})`);
    }

    this.emit('nextData', item);
    await this.waitAllAsync();

    this._lastItem = item;
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
