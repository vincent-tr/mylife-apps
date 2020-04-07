import { createLogger } from 'mylife-tools-server';

import { Resolution } from '../broker';
import { Timeline } from './timeline';

const logger = createLogger('mylife:trading:broker:backtest:engine');

export interface Configuration {
  readonly instrumentId: string;
  readonly resolution: Resolution; // always m1
  readonly spread: number;
}

export default class Engine {
  public readonly timeline: Timeline;
  private readonly pendingPromises = new Set<Promise<void>>();

  constructor(public readonly configuration: Configuration) {
  }

  async init() {

  }

  async terminate() {

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
