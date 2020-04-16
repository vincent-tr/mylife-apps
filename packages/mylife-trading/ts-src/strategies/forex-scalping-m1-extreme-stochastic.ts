import { SMA, Stochastic } from 'technicalindicators';
import { createLogger } from 'mylife-tools-server';
import { Resolution, MovingDataset, Position, PositionDirection } from '../broker';
import { last, round, PIP, analyzeTrend } from '../utils';
import ForexScalpingBase from './forex-scalping-base';

const logger = createLogger('mylife:trading:strategy:forex-scalping-m1-extreme-stochastic');

const STOP_LOSS_DISTANCE = 20;
const TAKE_PROFIT_DISTANCE = 10;

export default class ForexScalpingM1ExtremeStochastic extends ForexScalpingBase {
	private dataset: MovingDataset;
	private lastProcessedTimestamp: number;
	private position: Position;

	async open() {
		this.dataset = await this.broker.getDataset(this.instrument.instrumentId, Resolution.M1, 1010);
		this.dataset.on('add', () => this.onDatasetChange());
		this.dataset.on('update', () => this.onDatasetChange());

		this.onDatasetChange();
	}

	async close() {
		if (this.position) {
			await this.position.close();
		}

		if (this.dataset) {
			this.dataset.close();
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
		const { fixedList } = this.dataset;
    const values = fixedList.map(record => record.average.close);
    
    const sma = SMA.calculate({period : 1000, values : values});
    const trend = analyzeTrend(sma);

    const stochastic = Stochastic.calculate({
      high: fixedList.map(record => record.average.high),
      low: fixedList.map(record => record.average.low),
      close: values,
      period: 14,
      signalPeriod: 3
		});

		return { trend, stochastic };
	}

	private async takePosition(direction: PositionDirection) {
		// convert risk value to contract size
		const size = this.computePositionSize(this.instrument, STOP_LOSS_DISTANCE);
		this.position = await this.broker.openPosition(this.instrument, direction, size, { distance: STOP_LOSS_DISTANCE }, { distance: TAKE_PROFIT_DISTANCE });
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
		const { trend, stochastic } = this.getIndicators();
		logger.debug(`analyze (trend=${trend}, stochastic=${JSON.stringify(stochastic)})`);

		if (this.position) {
			return;
		}
/*
		// see if we can take position
		if (this.canSell(rsi, bb, level)) {
			if (this.waitingMarketStable) {
				return;
			}

			logger.info(`(${this.configuration.name}) Sell (rsi=${rsi}, average candle close=${level}, bb upper=${bb.upper})`);
			await this.takePosition(PositionDirection.SELL, bb);
			return;
		}

		if (this.canBuy(rsi, bb, level)) {
			if (this.waitingMarketStable) {
				return;
			}

			logger.info(`(${this.configuration.name}) Buy (rsi=${rsi}, average candle close=${level}, bb lower=${bb.lower})`);
			await this.takePosition(PositionDirection.BUY, bb);
			return;
		}
*/
	}
/*
	private canSell(rsi: number, bb: BollingerBandsOutput, level: number) {
		return this.isDiffEnough(bb, level) && rsi > 70 && level > bb.upper;
	}

	private canBuy(rsi: number, bb: BollingerBandsOutput, level: number) {
		return this.isDiffEnough(bb, level) && rsi < 30 && level < bb.lower;
	}

	// do not take position if takeprofit is too close (less than 5 pips)
	private isDiffEnough(bb: BollingerBandsOutput, level: number) {
		return Math.abs(level - bb.middle) >= STOP_LOSS_DISTANCE * PIP;
	}
*/
}
