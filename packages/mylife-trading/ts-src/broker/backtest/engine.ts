import EventEmitter from 'events';
import { createLogger } from 'mylife-tools-server';

import { TestSettings } from '../broker';
import { Timeline } from './timeline';
import Cursor, { HistoricalDataItem } from './cursor';

const logger = createLogger('mylife:trading:broker:backtest:engine');

interface Engine extends EventEmitter {
  on(event: 'nextData', listener: (item: HistoricalDataItem) => void): this;
}

class Engine extends EventEmitter implements Engine {
  public readonly timeline: Timeline;
  private readonly cursor: Cursor;
  private readonly pendingPromises = new Set<Promise<void>>();

  constructor(public readonly configuration: TestSettings) {
    super();

    this.timeline = new Timeline(this.configuration.resolution);
    this.cursor = new Cursor(this.configuration.resolution, this.configuration.instrumentId);
  }

  async init() {
    const data = await this.cursor.next();
    this.timeline.set(data.date);

    this.emit('nextData', data);
    await this.waitAllAsync();
  }

  // TODO: call it
  private async tick() {
    const data = await this.cursor.next();
    // TODO: handle finish
    this.timeline.increment();

    if (this.timeline.current.getTime() !== data.date.getTime()) {
      throw new Error(`Timeline (${this.timeline.current.toISOString()}) does not correspond to cursor (${data.date.toISOString()})`);
    }

    this.emit('nextData', data);
    await this.waitAllAsync();
  }

  async terminate() {
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
