import { RSI, BollingerBands } from 'technicalindicators';
import Strategy from './strategy';
import { Datasource, Resolution } from './datasource';
import MovingDataset from './moving-dataset';
import { last } from './utils'

export default class Strategy1 implements Strategy {
  private datasource: Datasource;
  private dataset: MovingDataset;
  private lastProcessedTimestamp: number;

  async init() {
    this.datasource = new Datasource({ key: process.env.IGKEY, identifier: process.env.IGID, password: process.env.IGPASS, isDemo: true });
    await this.datasource.init();
    console.log('datasource init');

    this.dataset = await this.datasource.getDataset('CS.D.EURUSD.CFD.IP', Resolution.MINUTE, 16);
    this.dataset.on('error', err => console.error('ERROR', err));
    this.dataset.on('add', () => this.onDatasetChange());
    this.dataset.on('update', () => this.onDatasetChange());

    this.onDatasetChange();
  }

  async terminate() {
    this.dataset.close();
    await this.datasource.terminate();
    console.log('datasource terminate');
  }

  private onDatasetChange() {
    if(!this.shouldRun()) {
      return;
    }

    const period = 14;
    const { fixedList } = this.dataset;
    const values = fixedList.map(record => record.average.close);

    const rsi = last(RSI.calculate({ period, values }));
    const bb = last(BollingerBands.calculate({ period, values, stdDev: 2 }));
    const candle = last(fixedList);

    if(rsi > 70 && candle.ask.close > bb.upper) {
      console.log(new Date().toISOString(), 'SHOULD SELL', rsi, candle.ask.close, bb.upper);
    }

    if(rsi < 30 && candle.ask.close < bb.lower) {
      console.log(new Date().toISOString(), 'SHOULD BUY', rsi, candle.ask.close, bb.lower);
    }
  }

  private shouldRun() {
    const fixedRecords = this.dataset.fixedList;
    const lastTimestamp = fixedRecords[fixedRecords.length - 1].timestamp.valueOf();
    if(lastTimestamp === this.lastProcessedTimestamp) {
      return false;
    }

    this.lastProcessedTimestamp = lastTimestamp
    return true;
  }
}

