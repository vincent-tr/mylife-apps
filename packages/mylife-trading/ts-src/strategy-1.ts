import { RSI, BollingerBands } from 'technicalindicators';
import { createLogger } from 'mylife-tools-server';
import Strategy from './strategy';
import { Broker, Resolution, MovingDataset, DealDirection, Position, InstrumentDetails } from './broker';
import { last, round } from './utils';
import { BollingerBandsOutput } from 'technicalindicators/declarations/volatility/BollingerBands';

const logger = createLogger('mylife:trading:strategy-1');

export default class Strategy1 implements Strategy {
  private datasource: Broker;
  private dataset: MovingDataset;
  private lastProcessedTimestamp: number;
  private position: Position;
  private instrument: InstrumentDetails;

  async init() {
    this.datasource = new Broker({ key: process.env.IGKEY, identifier: process.env.IGID, password: process.env.IGPASS, isDemo: true });
    await this.datasource.init();
    logger.debug('datasource init');

    const market = await this.datasource.getEpic('CS.D.EURUSD.MINI.IP');
    this.instrument = market.instrument;

    this.dataset = await this.datasource.getDataset(this.instrument.epic, Resolution.MINUTE, 16);
    this.dataset.on('error', err => console.error('ERROR', err));
    this.dataset.on('add', () => this.onDatasetChange());
    this.dataset.on('update', () => this.onDatasetChange());

    this.onDatasetChange();
  }

  async terminate() {
    this.dataset.close();
    await this.datasource.terminate();
    logger.debug('datasource terminate');
  }

  private onDatasetChange() {
    if (!this.shouldRun()) {
      return;
    }

    this.analyze().catch(err => console.error(err));
  }

  private shouldRun() {
    const fixedRecords = this.dataset.fixedList;
    const lastTimestamp = fixedRecords[fixedRecords.length - 1].timestamp.valueOf();
    if (lastTimestamp === this.lastProcessedTimestamp) {
      return false;
    }

    this.lastProcessedTimestamp = lastTimestamp;
    return true;
  }

  private getIndicators() {
    const period = 14;
    const { fixedList } = this.dataset;
    const values = fixedList.map(record => record.average.close);

    const rsi = last(RSI.calculate({ period, values }));
    const bb = last(BollingerBands.calculate({ period, values, stdDev: 2 }));
    const candle = last(fixedList);

    return { rsi, bb, candle };
  }

  private async takePosition(direction: DealDirection, bb: BollingerBandsOutput) {
    // TODO: as parameter
    const riskValue = 5; // risk 5eur per position

    // convert risk value to contract size
    const STOP_LOSS_DISTANCE = 5;
    const size = computePositionSize(this.instrument, STOP_LOSS_DISTANCE, riskValue);
    this.position = await this.datasource.openPosition(this.instrument, direction, size, { distance: STOP_LOSS_DISTANCE }, { level: round(bb.middle, 5) });

    this.position.on('close', () => {
      console.log('POSITION CLOSED');
      this.position = null;
    });
  }

  private async analyze() {

    const { rsi, bb, candle } = this.getIndicators();

    if (this.position) {
      // move takeprofit regarding bb
      await this.position.updateTakeProfit(bb.middle);
      return;
    }

    // see if we can take position
    await this.takePosition(DealDirection.BUY, bb);
    return;

    if (rsi > 70 && candle.average.close > bb.upper) {
      console.log(new Date().toISOString(), 'SHOULD SELL', rsi, candle.average.close, bb.upper);
      await this.takePosition(DealDirection.SELL, bb);
    }

    if (rsi < 30 && candle.average.close < bb.lower) {
      console.log(new Date().toISOString(), 'SHOULD BUY', rsi, candle.average.close, bb.lower);
      await this.takePosition(DealDirection.BUY, bb);
    }
  }
}

function computePositionSize(instrument: InstrumentDetails, stopLossDistance: number, riskValue: number) {
  const valueOfOnePip = parseFloat(instrument.valueOfOnePip);
  const exchangeRate = instrument.currencies[0].baseExchangeRate;
  const valueOfOnePipAccountCurrency = valueOfOnePip / exchangeRate; // conver pip value from market target currency to account currency

  const size = riskValue / (valueOfOnePipAccountCurrency * stopLossDistance);
  return round(size, 2);
}