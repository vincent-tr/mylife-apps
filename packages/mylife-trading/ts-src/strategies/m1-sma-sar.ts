import { SMA, PSAR } from 'technicalindicators';
import { createLogger } from 'mylife-tools-server';
import { Resolution, MovingDataset, Position, PositionDirection } from '../broker';
import { last } from '../utils';
import ScalpingBase from './scalping-base';

const logger = createLogger('mylife:trading:strategy:m1-sma-sar');

// https://forexexperts.net/index.php/trade-strategy/scalping-strategies/62-hit-run-scalping-trading
const STOP_LOSS_DISTANCE = 15;
const TAKE_PROFIT_DISTANCE = 10;

export default class M1SmaSar extends ScalpingBase {
	private dataset: MovingDataset;
	private lastProcessedTimestamp: number;
	private position: Position;

	async open() {
		this.dataset = await this.broker.getDataset(this.instrument.instrumentId, Resolution.M1, 52);
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
		const sma = SMA.calculate({ period: 50, values: values });

		const lasts = fixedList.slice(-30);
		const sarRaw = PSAR.calculate({
			high: lasts.map(record => record.average.high),
			low: lasts.map(record => record.average.low),
			step: 0.02,
			max: 0.2
		});
		const sar = sarRaw.slice(-2);

		const candle = last(fixedList);

		return { candle, sma: last(sma), sar };
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

		const { candle, sma, sar } = this.getIndicators();
		const level = candle.average.close;
		logger.debug(`analyze (level=${level}, sma=${sma}, sar=${JSON.stringify(sar)})`);

		// see if we can take position
		if (this.canBuy(level, sma, sar)) {
			logger.info(`(${this.configuration.name}) Buy (level=${level}, sma=${sma}, sar=${JSON.stringify(sar)})`);
			await this.takePosition(PositionDirection.BUY);
			return;
		}

		if (this.canSell(level, sma, sar)) {
			logger.info(`(${this.configuration.name}) Sell (level=${level}, sma=${sma}, sar=${JSON.stringify(sar)})`);
			await this.takePosition(PositionDirection.SELL);
			return;
		}
	}

	private canBuy(level: number, sma: number, sar: number[]) {
		return level > sma && sar[0] < level && sar[1] > level;
	}

	private canSell(level: number, sma: number, sar: number[]) {
		return level < sma && sar[0] > level && sar[1] < level;
	}

}
