import { RSI, BollingerBands } from 'technicalindicators';
import { createLogger } from 'mylife-tools-server';
import Strategy, { Configuration, Listeners } from './strategy';
import { Broker, Resolution, MovingDataset, DealDirection, Position, InstrumentDetails, Credentials } from '../broker';
import { last, round } from '../utils';
import { BollingerBandsOutput } from 'technicalindicators/declarations/volatility/BollingerBands';

const logger = createLogger('mylife:trading:strategy:forex-scalping-m1-extreme');

// https://admiralmarkets.com/fr/formation/articles/strategie-de-forex/strategie-forex-scalping-1-minute

// TODO: do not take position before/when market close

export default class ForexScalpingM1Extreme implements Strategy {
  private configuration: Configuration;
  private listeners: Listeners;
  private readonly broker = new Broker();
  private dataset: MovingDataset;
  private lastProcessedTimestamp: number;
  private position: Position;
  private instrument: InstrumentDetails;
  private currentStatus: string;

  async init(configuration: Configuration, credentials: Credentials, listeners: Listeners) {
    this.configuration = configuration;
    logger.debug(`(${this.configuration.name}) init`);
    this.listeners = listeners;
    this.changeStatus('Initialisation');

    try {
      await this.broker.init(credentials);
  
      const market = await this.broker.getEpic(this.configuration.epic);
      this.instrument = market.instrument;
  
      this.dataset = await this.broker.getDataset(this.instrument.epic, Resolution.MINUTE, 16);
      this.dataset.on('error', err => logger.error(`(${this.configuration.name}) Dataset error: ${err.stack}`));
      this.dataset.on('add', () => this.onDatasetChange());
      this.dataset.on('update', () => this.onDatasetChange());
  
      this.onDatasetChange();
    } catch(err) {
      logger.error(`(${this.configuration.name}) init error: ${err.stack}`);
      this.listeners.onFatalError(err);
    }
  }

  async terminate() {
    try {
      this.changeStatus('Mise à l\'arrêt');
      if (this.position) {
        await this.position.close();
      }
      this.dataset.close();

      await this.broker.terminate();
      logger.debug(`(${this.configuration.name}) terminate`);
    } catch(err) {
      logger.error(`(${this.configuration.name}) terminate error: ${err.stack}`);
    }
  }

  private fireAsync<T>(target: () => Promise<T>) {
    target().catch(err => {
      logger.error(`(${this.configuration.name}) runtime error: ${err.stack}`);
      this.listeners.onFatalError(err)
    });
  }

  private changeStatus(status: string) {
    if (status === this.currentStatus) {
      return;
    }

    logger.debug(`(${this.configuration.name}) change status: '${status}'`);
    this.currentStatus = status;
    this.listeners.onStatusChanged(status);
  }

  private changeStatusTakingPosition() {
    this.changeStatus('Prise de position');
  }

  private changeStatusMarketLookup() {
    this.changeStatus('Surveillance du marché');
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
    const size = computePositionSize(this.instrument, STOP_LOSS_DISTANCE, this.configuration.risk);
    this.position = await this.broker.openPosition(this.instrument, direction, size, { distance: STOP_LOSS_DISTANCE }, { level: round(bb.middle, 5) });
    this.changeStatusTakingPosition();

    this.position.on('close', () => {
      const position = this.position;
      this.position = null;

      this.fireAsync(async () => {
        const summary = await this.broker.getPositionSummary(position);
        logger.info(`(${this.configuration.name}) Position closed: ${JSON.stringify(summary)}`);

        this.listeners.onNewPositionSummary(summary);
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

function computePositionSize(instrument: InstrumentDetails, stopLossDistance: number, riskValue: number) {
  const valueOfOnePip = parseFloat(instrument.valueOfOnePip);
  const exchangeRate = instrument.currencies[0].baseExchangeRate;
  const valueOfOnePipAccountCurrency = valueOfOnePip / exchangeRate; // convert pip value from market target currency to account currency

  const size = riskValue / (valueOfOnePipAccountCurrency * stopLossDistance);
  return round(size, 2);
}
