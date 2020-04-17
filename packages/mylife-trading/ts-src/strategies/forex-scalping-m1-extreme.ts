import { RSI, BollingerBands } from 'technicalindicators';
import { createLogger } from 'mylife-tools-server';
import { Resolution, MovingDataset, Position, PositionDirection } from '../broker';
import { last, round, PIP } from '../utils';
import { BollingerBandsOutput } from 'technicalindicators/declarations/volatility/BollingerBands';
import ForexScalpingBase from './forex-scalping-base';

const logger = createLogger('mylife:trading:strategy:forex-scalping-m1-extreme');

const STOP_LOSS_DISTANCE = 5;

export default class ForexScalpingM1Extreme extends ForexScalpingBase {
	private dataset: MovingDataset;
	private lastProcessedTimestamp: number;
	private position: Position;
	private waitingMarketStable: boolean;

	async open() {
		this.dataset = await this.broker.getDataset(this.instrument.instrumentId, Resolution.M1, 23);
		this.dataset.on('add', () => this.onDatasetChange());
		this.dataset.on('update', () => this.onDatasetChange());

		this.waitingMarketStable = false;
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

		const rsi = last(RSI.calculate({ values, period: 14 }));
		const bb = last(BollingerBands.calculate({ values, period: 21, stdDev: 2 }));
		const candle = last(fixedList);

		return { rsi, bb, candle };
	}

	private async takePosition(direction: PositionDirection, bb: BollingerBandsOutput) {
		// convert risk value to contract size
		const size = this.computePositionSize(this.instrument, STOP_LOSS_DISTANCE);
		this.position = await this.broker.openPosition(this.instrument, direction, size, { distance: STOP_LOSS_DISTANCE }, { level: round(bb.middle, 5) });
		this.changeStatusTakingPosition();

		// wait for market stable before taking position again
		this.waitingMarketStable = true;

		this.position.on('close', () => {
			const position = this.position;
			this.position = null;

			this.fireAsync(async () => {
				const summary = await this.broker.getPositionSummary(position);
				logger.info(`(${this.configuration.name}) Position closed: ${JSON.stringify(summary)}`);

				this.positionSummary(summary);

				if (this.waitingMarketStable) {
					this.changeStatus('Attente de retour à la stabilité du marché');
				} else {
					this.changeStatusMarketLookup();
				}
			});
		});
	}

	private async analyze() {
		const { rsi, bb, candle } = this.getIndicators();
		const level = candle.average.close;
		logger.debug(`analyze (level=${level}, rsi=${rsi}, bb={l:${bb.lower}, m:${bb.middle}, u:${bb.upper}})`);

		if (this.position) {
			this.changeStatusTakingPosition();

			// move takeprofit regarding bb
			await this.position.updateTakeProfit(bb.middle);
			return;
		}

		// see if we can take position
		if (this.canBuy(rsi, bb, level)) {
			if (this.waitingMarketStable) {
				return;
			}

			logger.info(`(${this.configuration.name}) Buy (rsi=${rsi}, average candle close=${level}, bb lower=${bb.lower})`);
			await this.takePosition(PositionDirection.BUY, bb);
			return;
		}

		if (this.canSell(rsi, bb, level)) {
			if (this.waitingMarketStable) {
				return;
			}

			logger.info(`(${this.configuration.name}) Sell (rsi=${rsi}, average candle close=${level}, bb upper=${bb.upper})`);
			await this.takePosition(PositionDirection.SELL, bb);
			return;
		}

		// market is back to stable
		this.waitingMarketStable = false;
		this.changeStatusMarketLookup();
	}

	private canBuy(rsi: number, bb: BollingerBandsOutput, level: number) {
		return this.isDiffEnough(bb, level) && rsi < 30 && level < bb.lower;
	}

	private canSell(rsi: number, bb: BollingerBandsOutput, level: number) {
		return this.isDiffEnough(bb, level) && rsi > 70 && level > bb.upper;
	}

	// do not take position if takeprofit is too close (less than 5 pips)
	private isDiffEnough(bb: BollingerBandsOutput, level: number) {
		return Math.abs(level - bb.middle) >= STOP_LOSS_DISTANCE * PIP;
	}
}
