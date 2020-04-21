import { EMA } from 'technicalindicators';
import { createLogger } from 'mylife-tools-server';
import { Resolution, MovingDataset, Position, PositionDirection } from '../broker';
import { last } from '../utils';
import ScalpingBase from './scalping-base';

const logger = createLogger('mylife:trading:strategy:m1-3ema');

// https://www.forexstrategiesresources.com/trend-following-forex-strategies/70-3ema-s/

export default class M13Ema extends ScalpingBase {
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

	private getEma(values: number[], period: number) {
		const ema = EMA.calculate({ period, values });
		return ema.slice(-2);
	}

	private getIndicators() {
		const { fixedList } = this.dataset;

		const values = fixedList.map(record => record.average.close);
		const ema1 = this.getEma(values, 3);
		const ema2 = this.getEma(values, 13);
		const ema3 = this.getEma(values, 144);

		const candle = last(fixedList);

		const lasts = fixedList.slice(-5);
		const lastLows = Math.min(...lasts.map(record => record.average.low));
		const lastHighs = Math.max(...lasts.map(record => record.average.high));

		return { candle, ema1, ema2, ema3, lastLows, lastHighs };
	}

	private async takePosition(direction: PositionDirection, level: number, stopLoss: number) {
		// convert risk value to contract size
		const size = this.computePositionSize(this.instrument, Math.abs(level - stopLoss));
		this.position = await this.broker.openPosition(this.instrument, direction, size, { level: stopLoss }, { distance: TAKE_PROFIT_DISTANCE });
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

		const { candle, ema1, ema2, ema3, lastLows, lastHighs } = this.getIndicators();
		const level = candle.average.close;
		logger.debug(`analyze (level=${level}, ema1=${JSON.stringify(ema1)}, ema2=${JSON.stringify(ema2)}, ema3=${JSON.stringify(ema3)})`);

		// see if we can take position
		if (this.canBuy(level, ema1, ema2, ema3)) {
			logger.info(`(${this.configuration.name}) Buy (level=${level}, stopLoss=${lastLows}, ema1=${JSON.stringify(ema1)}, ema2=${JSON.stringify(ema2)}, ema3=${JSON.stringify(ema3)})`);
			await this.takePosition(PositionDirection.BUY, level, lastLows);
			return;
		}

		if (this.canSell(level, ema1, ema2, ema3)) {
			logger.info(`(${this.configuration.name}) Sell (level=${level}, stopLoss=${lastHighs}, ema1=${JSON.stringify(ema1)}, ema2=${JSON.stringify(ema2)}, ema3=${JSON.stringify(ema3)})`);
			await this.takePosition(PositionDirection.SELL, level, lastHighs);
			return;
		}
	}

	private canBuy(level: number, ema1: number[], ema2: number[], ema3: number[]) {
		// price above all
		if(level <= ema1[1] || level <= ema2[1] || level <= ema3[1]) {
			return false;
		}

		// ema1 and 2 above ema3
		if(ema1[0] <= ema3[0] || ema1[1] <= ema3[1] || ema2[0] <= ema3[0] || ema2[1] <= ema3[1]) {
			return false;
		}

		// ema1 cross ema2 to upper
		return ema1[0] < ema2[0] && ema1[1] > ema2[1];
	}

	private canSell(level: number, ema1: number[], ema2: number[], ema3: number[]) {
		// price below all
		if(level >= ema1[1] || level >= ema2[1] || level >= ema3[1]) {
			return false;
		}

		// ema1 and 2 below ema3
		if(ema1[0] >= ema3[0] || ema1[1] >= ema3[1] || ema2[0] >= ema3[0] || ema2[1] >= ema3[1]) {
			return false;
		}

		// ema1 cross ema2 to lower
		return ema1[0] > ema2[0] && ema1[1] < ema2[1];
	}

}
