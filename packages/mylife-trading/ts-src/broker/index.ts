import { parse } from 'fecha';
import Client from './ig/client';
import { PriceResolution } from './ig/market';
import MovingDataset, { Record, CandleStickData } from './moving-dataset';
import Position from './position';
import { StreamSubscription } from './ig/stream';
import { OpenPositionOrder, DealDirection } from './ig/dealing';

export { MovingDataset };
export * from './moving-dataset';
export { Position };
export * from './position';

export interface Credentials {
  key: string;
  identifier: string;
  password: string;
  isDemo: boolean;
}

export enum Resolution {
  MINUTE,
  MINUTE_5,
  HOUR
}

interface ResolutionData {
  readonly rest: PriceResolution;
  readonly stream: string;
}

const resolutions = new Map<Resolution, ResolutionData>();
resolutions.set(Resolution.MINUTE, { rest: PriceResolution.MINUTE, stream: '1MINUTE' });
resolutions.set(Resolution.MINUTE_5, { rest: PriceResolution.MINUTE_5, stream: '5MINUTE' });
resolutions.set(Resolution.HOUR, { rest: PriceResolution.HOUR, stream: 'HOUR' });

const datasetSubscriptionFields = ['UTM', 'OFR_OPEN', 'OFR_HIGH', 'OFR_LOW', 'OFR_CLOSE', 'BID_OPEN', 'BID_HIGH', 'BID_LOW', 'BID_CLOSE'/*,'LTP_OPEN','LTP_HIGH','LTP_LOW','LTP_CLOSE'*/, 'CONS_END'];
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

export class Broker {
  private readonly client: Client;
  private tradeSubscription: TradeSubscription;

  constructor(credentials: Credentials) {
    this.client = new Client(credentials.key, credentials.identifier, credentials.password, credentials.isDemo);
  }

  async init() {
    await this.client.login();
  }

  async terminate() {
    await this.client.logout();
  }

  async getDataset(epic: string, resolution: Resolution, size: number): Promise<MovingDataset> {
    const resolutionData = resolutions.get(resolution);

    const dataset = new MovingDataset(size);
    const prices = await this.client.market.prices(epic, resolutionData.rest, size);
    for (const price of prices.prices) {
      const ask = new CandleStickData(price.openPrice.ask, price.closePrice.ask, price.highPrice.ask, price.lowPrice.ask);
      const bid = new CandleStickData(price.openPrice.bid, price.closePrice.bid, price.highPrice.bid, price.lowPrice.bid);
      dataset.add(new Record(ask, bid, parseDate(price.snapshotTime)));
    }

    const subscription = this.client.subscribe('MERGE', [`CHART:${epic}:${resolutionData.stream}`], datasetSubscriptionFields);
    dataset.on('close', () => subscription.close());
    subscription.on('error', err => dataset.emit('error', err));
    subscription.on('update', data => {
      const ask = new CandleStickData(data.OFR_OPEN, data.OFR_CLOSE, data.OFR_HIGH, data.OFR_LOW);
      const bid = new CandleStickData(data.BID_OPEN, data.BID_CLOSE, data.BID_HIGH, data.BID_LOW);
      const record = new Record(ask, bid, new Date(data.UTM));
      if (data.CONS_END) {
        record.fix();
      }

      dataset.add(record);
    });

    return dataset;
  }

  private refTradeSubscription(): StreamSubscription {
    if (!this.tradeSubscription) {
      const subscription = this.client.subscribe('DISTINCT', [`TRADE:${this.client.accountIdentifier()}`], datasetSubscriptionFields);
      this.tradeSubscription = new TradeSubscription(subscription);
    }

    return this.tradeSubscription.ref();
  }

  private unrefTradeSubscription() {
    if (this.tradeSubscription.unref()) {
      this.tradeSubscription = null;
    }
  }

  async openPosition(epic: string, direction: DealDirection, stopLoss: number, takeProfit: number, size: number): Promise<Position> {
    // forceOpen: boolean;
    // guaranteedStop: boolean;
    // orderType: OrderType;
    // timeInForce: TimeInForce;

    const order: OpenPositionOrder = { epic, direction, dealReference: randomString(), limitLevel: takeProfit, stopLevel: stopLoss, size };
    const dealReference = await this.client.dealing.openPosition(order);

    const position = new Position(this.client, this.refTradeSubscription(), dealReference);
    position.on('close', () => this.unrefTradeSubscription());

    return position;
  }
}

function parseDate(value: string): Date {
  const result = parse(value, 'YYYY/MM/DD HH:mm:ss');
  return result ? <Date>result : null;
}

function randomString() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}