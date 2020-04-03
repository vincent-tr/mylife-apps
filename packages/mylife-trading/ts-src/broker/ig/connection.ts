import { createLogger } from 'mylife-tools-server';
import Client from './api/client';
import { StreamSubscription } from './api/stream';
import { Mutex } from 'async-mutex';

const logger = createLogger('mylife:trading:broker:connection');

export interface Credentials {
  key: string;
  identifier: string;
  password: string;
  isDemo: boolean;
}

const positionSubscriptionFields = ['CONFIRMS', 'OPU'];

class TradeSubscription {
  private refCount: number = 0;

  constructor(private readonly subscription: StreamSubscription) {
  }

  ref() {
    ++this.refCount;
    return this.subscription;
  }

  unref() {
    const doClose = --this.refCount === 0;
    if (doClose) {
      this.subscription.close();
    }
    return doClose;
  }
}

export class Connection {
  public readonly client: Client;
  private tradeSubscription: TradeSubscription;
  private refCount: number = 0;

  constructor(public readonly key: string, credentials: Credentials) {
    this.client = new Client(credentials.key, credentials.identifier, credentials.password, credentials.isDemo);
  }

  async init() {
    logger.debug(`init ${this.key}`);
    await this.client.login();
  }

  async terminate() {
    logger.debug(`terminate ${this.key}`);
    await this.client.logout();
  }

  ref() {
    ++this.refCount;
  }

  unref() {
    return --this.refCount === 0;
  }

  refTradeSubscription(): StreamSubscription {
    if (!this.tradeSubscription) {
      const subscription = this.client.subscribe('DISTINCT', [`TRADE:${this.client.accountIdentifier()}`], positionSubscriptionFields);
      this.tradeSubscription = new TradeSubscription(subscription);
    }

    return this.tradeSubscription.ref();
  }

  unrefTradeSubscription() {
    if (this.tradeSubscription.unref()) {
      this.tradeSubscription = null;
    }
  }
}

const connections = new Map<string, Connection>();
const mutex = new Mutex();

export async function connectionOpen(credentials: Credentials): Promise<Connection> {
  return await mutex.runExclusive(async () => {
    const key = JSON.stringify([credentials.key, credentials.identifier, credentials.isDemo]);
    const existing = connections.get(key);
    if (existing) {
      existing.ref();
      return existing;
    }

    const connection = new Connection(key, credentials);
    await connection.init();
    connections.set(key, connection);
    connection.ref();
    return connection;
  });
}

export async function connectionClose(connection: Connection) {
  if(!connection.unref()) {
    return;
  }

  await mutex.runExclusive(async () => {
    await connection.terminate();
    connections.delete(connection.key);
  });
}