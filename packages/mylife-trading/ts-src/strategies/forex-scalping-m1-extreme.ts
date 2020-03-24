import { RSI, BollingerBands } from 'technicalindicators';
import { createLogger } from 'mylife-tools-server';
import Strategy from './strategy';
import { Broker, Resolution, MovingDataset, DealDirection, Position, InstrumentDetails } from '../broker';
import { last, round, fireAsync } from '../utils';
import { BollingerBandsOutput } from 'technicalindicators/declarations/volatility/BollingerBands';

const logger = createLogger('mylife:trading:strategy:forex-scalping-m1-extreme');

// https://admiralmarkets.com/fr/formation/articles/strategie-de-forex/strategie-forex-scalping-1-minute

// TODO: do not take position before/when market close

export default class ForexScalpingM1Extreme implements Strategy {
  private broker: Broker;
  private dataset: MovingDataset;
  private lastProcessedTimestamp: number;
  private position: Position;
  private instrument: InstrumentDetails;

  async init() {
    this.broker = new Broker();
    await this.broker.init({ key: process.env.IGKEY, identifier: process.env.IGID, password: process.env.IGPASS, isDemo: true });
    logger.debug('init');

    const market = await this.broker.getEpic('CS.D.EURUSD.MINI.IP');
    this.instrument = market.instrument;

    this.dataset = await this.broker.getDataset(this.instrument.epic, Resolution.MINUTE, 16);
    this.dataset.on('error', err => logger.error(`Dataset error: ${err.stack}`));
    this.dataset.on('add', () => this.onDatasetChange());
    this.dataset.on('update', () => this.onDatasetChange());

    this.onDatasetChange();
  }

  async terminate() {
    if (this.position) {
      await this.position.close();
    }
    this.dataset.close();
    await this.broker.terminate();
    logger.debug('terminate');
  }

  private onDatasetChange() {
    if (!this.shouldRun()) {
      return;
    }

    fireAsync(() => this.analyze());
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
    this.position = await this.broker.openPosition(this.instrument, direction, size, { distance: STOP_LOSS_DISTANCE }, { level: round(bb.middle, 5) });

    this.position.on('close', () => {
      const position = this.position;
      this.position = null;

      fireAsync(async () => {
        const summary = await this.broker.getPositionSummary(position);
        logger.info(`Position closed: ${JSON.stringify(summary)}`);

        // TODO: add stats data
      });
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
    if (rsi > 70 && candle.average.close > bb.upper) {
      logger.info(`Sell (rsi=${rsi}, average candle close=${candle.average.close}, bb upper=${bb.upper})`);
      await this.takePosition(DealDirection.SELL, bb);
    }

    if (rsi < 30 && candle.average.close < bb.lower) {
      logger.info(`Buy (rsi=${rsi}, average candle close=${candle.average.close}, bb lower=${bb.lower})`);
      await this.takePosition(DealDirection.BUY, bb);
    }
  }
}

function computePositionSize(instrument: InstrumentDetails, stopLossDistance: number, riskValue: number) {
  const valueOfOnePip = parseFloat(instrument.valueOfOnePip);
  const exchangeRate = instrument.currencies[0].baseExchangeRate;
  const valueOfOnePipAccountCurrency = valueOfOnePip / exchangeRate; // convert pip value from market target currency to account currency

  const size = riskValue / (valueOfOnePipAccountCurrency * stopLossDistance);
  return round(size, 2);
}
