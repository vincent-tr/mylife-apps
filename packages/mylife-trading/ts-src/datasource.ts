import { parse } from 'fecha';
import MovingDataset, { Record, CandleStickData } from './moving-dataset';
import Client from './broker/ig/client';
import { PriceResolution } from './broker/ig/market';

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

const subscriptionFields = ['UTM', 'OFR_OPEN', 'OFR_HIGH', 'OFR_LOW', 'OFR_CLOSE', 'BID_OPEN', 'BID_HIGH', 'BID_LOW', 'BID_CLOSE'/*,'LTP_OPEN','LTP_HIGH','LTP_LOW','LTP_CLOSE'*/, 'CONS_END'];

export class Datasource {
  readonly client: Client;
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
    for(const price of prices.prices) {
      const ask = new CandleStickData(price.openPrice.ask, price.closePrice.ask, price.highPrice.ask, price.lowPrice.ask);
      const bid = new CandleStickData(price.openPrice.bid, price.closePrice.bid, price.highPrice.bid, price.lowPrice.bid);
      dataset.add(new Record(ask, bid, parseDate(price.snapshotTime)));
    }

    const subscription = this.client.subscribe('MERGE', [`CHART:${epic}:${resolutionData.stream}`], subscriptionFields);
    dataset.on('close', () => subscription.close());
    subscription.on('error', err => dataset.emit('error', err));
    subscription.on('update', data => {
      const ask = new CandleStickData(data.OFR_OPEN, data.OFR_CLOSE, data.OFR_HIGH, data.OFR_LOW);
      const bid = new CandleStickData(data.BID_OPEN, data.BID_CLOSE, data.BID_HIGH, data.BID_LOW);
      const record = new Record(ask, bid, new Date(data.UTM));
      if(data.CONS_END) {
        record.fix();
      }
      
      dataset.add(record);
    });

    return dataset;
  }
}

function parseDate(value: string): Date {
  const result = parse(value, 'YYYY/MM/DD HH:mm:ss');
  return result ? <Date>result : null;
}