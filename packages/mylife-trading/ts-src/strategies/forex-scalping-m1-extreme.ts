import { RSI, BollingerBands } from 'technicalindicators';
import { createLogger } from 'mylife-tools-server';
import { Broker, Resolution, MovingDataset, DealDirection, Position, InstrumentDetails, Credentials } from '../broker';
import { last, round } from '../utils';
import { BollingerBandsOutput } from 'technicalindicators/declarations/volatility/BollingerBands';
import StrategyBase from './strategy-base';

const logger = createLogger('mylife:trading:strategy:forex-scalping-m1-extreme');

// https://admiralmarkets.com/fr/formation/articles/strategie-de-forex/strategie-forex-scalping-1-minute

// TODO: do not take position before/when market close

export default class ForexScalpingM1Extreme extends StrategyBase {
  private broker: Broker;
  private dataset: MovingDataset;
  private lastProcessedTimestamp: number;
  private position: Position;
  private instrument: InstrumentDetails;

  async initImpl(credentials: Credentials) {
    this.broker = new Broker();
    await this.broker.init(credentials);

    const market = await this.broker.getEpic(this.configuration.epic);
    this.instrument = market.instrument;

    this.dataset = await this.broker.getDataset(this.instrument.epic, Resolution.MINUTE, 16);
    this.dataset.on('error', err => logger.error(`(${this.configuration.name}) Dataset error: ${err.stack}`));
    this.dataset.on('add', () => this.onDatasetChange());
    this.dataset.on('update', () => this.onDatasetChange());

    this.onDatasetChange();
  }

  async terminateImpl() {
    if (this.position) {
      await this.position.close();
    }

    if (this.dataset) {
      this.dataset.close();
    }
    
    if (this.broker) {
      await this.broker.terminate();
      this.broker = null;
    }
  }

  private onDatasetChange() {
    if (!this.shouldRun()) {
      return;
    }

    this.fireAsync(() => this.analyze());
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
    // convert risk value to contract size
    const STOP_LOSS_DISTANCE = 5;
    const size = this.computePositionSize(this.instrument, STOP_LOSS_DISTANCE);
    this.position = await this.broker.openPosition(this.instrument, direction, size, { distance: STOP_LOSS_DISTANCE }, { level: round(bb.middle, 5) });
    this.changeStatusTakingPosition();

    this.position.on('close', () => {
      const position = this.position;
      this.position = null;

      this.fireAsync(async () => {
        const summary = await this.broker.getPositionSummary(position);
        logger.info(`(${this.configuration.name}) Position closed: ${JSON.stringify(summary)}`);

        this.positionSummary(summary);
        this.changeStatusMarketLookup();
      });
    });
  }

  private async analyze() {

    const { rsi, bb, candle } = this.getIndicators();

    if (this.position) {
      this.changeStatusTakingPosition();
      
      // move takeprofit regarding bb
      await this.position.updateTakeProfit(bb.middle);
      return;
    }

    this.changeStatusMarketLookup();

    // see if we can take position
    if (rsi > 70 && candle.average.close > bb.upper) {
      logger.info(`(${this.configuration.name}) Sell (rsi=${rsi}, average candle close=${candle.average.close}, bb upper=${bb.upper})`);
      await this.takePosition(DealDirection.SELL, bb);
    }

    if (rsi < 30 && candle.average.close < bb.lower) {
      logger.info(`(${this.configuration.name}) Buy (rsi=${rsi}, average candle close=${candle.average.close}, bb lower=${bb.lower})`);
      await this.takePosition(DealDirection.BUY, bb);
    }
  }
}
