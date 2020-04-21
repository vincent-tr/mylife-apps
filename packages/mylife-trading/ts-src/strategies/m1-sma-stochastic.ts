import { SMA, Stochastic } from 'technicalindicators';
import { createLogger } from 'mylife-tools-server';
import { Resolution, MovingDataset, Position, PositionDirection } from '../broker';
import { analyzeTrend, last } from '../utils';
import ScalpingBase from './scalping-base';

const logger = createLogger('mylife:trading:strategy:forex-scalping-m1-extreme-stochastic');

const STOP_LOSS_DISTANCE = 20;
const TAKE_PROFIT_DISTANCE = 10;

export default class M1SmaStochastic extends ScalpingBase {
	private dataset: MovingDataset;
	private lastProcessedTimestamp: number;
	private position: Position;

	async open() {
		this.dataset = await this.broker.getDataset(this.instrument.instrumentId, Resolution.M1, 1020);
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
		const sma = SMA.calculate({ period: 1000, values: values });
		const trend = analyzeTrend(sma);

		const lasts = fixedList.slice(-30);
		const stochasticRaw = Stochastic.calculate({
			high: lasts.map(record => record.average.high),
			low: lasts.map(record => record.average.low),
			close: lasts.map(record => record.average.close),
			period: 14,
			signalPeriod: 3
		});
		const stochastic = stochasticRaw.slice(-2).map(item => item.k);

		const candle = last(fixedList);

		return { candle, sma: last(sma), trend, stochastic };
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
		if (this.position) {
			return;
		}

		this.changeStatusMarketLookup();

		const { candle, sma, trend, stochastic } = this.getIndicators();
		const level = candle.average.close;
		logger.debug(`analyze (level=${level}, trend=${trend}, sma=${sma}, stochastic=${JSON.stringify(stochastic)})`);

		// see if we can take position
		if (this.canBuy(level, sma, trend, stochastic)) {
			logger.info(`(${this.configuration.name}) Buy (level=${level}, trend=${trend}, sma=${sma}, stochastic=${JSON.stringify(stochastic)})`);
			await this.takePosition(PositionDirection.BUY);
			return;
		}

		if (this.canSell(level, sma, trend, stochastic)) {
			logger.info(`(${this.configuration.name}) Sell (level=${level}, trend=${trend}, sma=${sma}, stochastic=${JSON.stringify(stochastic)})`);
			await this.takePosition(PositionDirection.SELL);
			return;
		}
	}

	private canBuy(level: number, sma: number, trend: number, stochastic: number[]) {
		return trend === 1 && level > sma && stochastic[0] < 20 && stochastic[1] > 20;
	}

	private canSell(level: number, sma: number, trend: number, stochastic: number[]) {
		return trend === -1 && level < sma && stochastic[0] > 80 && stochastic[1] < 80;
	}

}
