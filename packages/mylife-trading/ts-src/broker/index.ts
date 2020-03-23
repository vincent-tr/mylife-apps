import { createLogger } from 'mylife-tools-server';
import Client from './ig/client';
import { PriceResolution } from './ig/market';
import MovingDataset, { Record, CandleStickData } from './moving-dataset';
import Position from './position';
import { StreamSubscription } from './ig/stream';
import { OpenPositionOrder, DealDirection, OrderType, TimeInForce, DealStatus } from './ig/dealing';
import { MarketDetails, InstrumentDetails } from './ig/market';
import { ConfirmationError } from './confirmation';
import { parseTimestamp, parseDate, parseISODate } from './parsing';

const logger = createLogger('mylife:trading:broker');

export { MovingDataset };
export * from './moving-dataset';
export { Position };
export * from './position';

export { DealDirection, MarketDetails, InstrumentDetails };

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

export interface OpenPositionBound {
  level?: number,
  distance?: number;
}

export interface PositionSummary {
  epic: string;
  dealId: string;
  openDate: Date;
  closeDate: Date;
  openLevel: number;
  closeLevel: number;
  size: number;
  profitAndLoss: number;
  currency: string;
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

  async getEpic(epic: string) {
    return await this.client.market.getMarket(epic);
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
      const record = new Record(ask, bid, parseTimestamp(data.UTM));
      if (data.CONS_END) {
        record.fix();
      }

      dataset.add(record);
    });

    return dataset;
  }

  private refTradeSubscription(): StreamSubscription {
    if (!this.tradeSubscription) {
      const subscription = this.client.subscribe('DISTINCT', [`TRADE:${this.client.accountIdentifier()}`], positionSubscriptionFields);
      this.tradeSubscription = new TradeSubscription(subscription);
    }

    return this.tradeSubscription.ref();
  }

  private unrefTradeSubscription() {
    if (this.tradeSubscription.unref()) {
      this.tradeSubscription = null;
    }
  }

  async openPosition(instrument: InstrumentDetails, direction: DealDirection, size: number, stopLoss: OpenPositionBound, takeProfit: OpenPositionBound): Promise<Position> {
    const order: OpenPositionOrder = {
      epic: instrument.epic,
      expiry: instrument.expiry,
      currencyCode: instrument.currencies[0].code,
      direction, dealReference: randomString(),
      limitLevel: takeProfit.level, limitDistance: takeProfit.distance,
      stopLevel: stopLoss.level, stopDistance: stopLoss.distance,
      size,
      forceOpen: true,
      guaranteedStop: false,
      orderType: OrderType.MARKET,
      timeInForce: TimeInForce.FILL_OR_KILL,
    };

    const dealReference = await this.client.dealing.openPosition(order);
    const confirmation = await this.client.dealing.confirm(dealReference);

    if(confirmation.dealStatus == DealStatus.REJECTED) {
      throw new ConfirmationError(confirmation.reason);
    }

    const position = new Position(this.client, this.refTradeSubscription(), confirmation);
    position.on('close', () => this.unrefTradeSubscription());

    return position;
  }

  async getPositionSummary(position: Position): Promise<PositionSummary> {
    const history = await this.client.account.accountTransactions();

    // find position
    // DIAAAADGRPS29A7 => ref = GRPS29A7
    const ref = position.dealId.substr(7);

    const transaction = history.transactions.find(transaction => ref === transaction.reference);
    if(!transaction) {
      throw new Error(`Transaction not found in history for position with dealId='${position.dealId}'`);
    }

    // eg: 'E+5.3'
    const profitAndLoss = transaction.profitAndLoss.substr(transaction.currency.length);

    return {
      epic: position.epic,
      dealId: position.dealId,
      openDate: parseISODate(transaction.openDateUtc),
      closeDate: parseISODate(transaction.dateUtc),
      openLevel: parseFloat(transaction.openLevel),
      closeLevel: parseFloat(transaction.closeLevel),
      size: parseFloat(transaction.size),
      profitAndLoss: parseFloat(profitAndLoss),
      currency: transaction.currency
    };
  }
}

function randomString() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}