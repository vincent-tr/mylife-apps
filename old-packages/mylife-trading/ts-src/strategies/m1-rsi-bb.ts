import { RSI, BollingerBands } from 'technicalindicators';
import { createLogger } from 'mylife-tools-server';
import { Resolution, MovingDataset, Position, PositionDirection, PositionCloseReason } from '../broker';
import { last, round, PIP } from '../utils';
import { BollingerBandsOutput } from 'technicalindicators/declarations/volatility/BollingerBands';
import ScalpingBase from './scalping-base';

const logger = createLogger('mylife:trading:strategy:m1-rsi-bb');

const STOP_LOSS_DISTANCE = 5;

export default class M1RsiBb extends ScalpingBase {
	protected readonly datasetResolution = Resolution.M1;
	protected readonly datasetSize = 23;

	private waitingMarketStable: boolean;

	async open() {
		await super.open();
		this.waitingMarketStable = false;
	}

	private getIndicators() {
		const values = this.datasetRecords.map(record => record.average.close);

		const rsi = last(RSI.calculate({ values, period: 14 }));
		const bb = last(BollingerBands.calculate({ values, period: 21, stdDev: 2 }));

		return { rsi, bb };
	}

	protected async analyze() {
		const { rsi, bb } = this.getIndicators();
		logger.debug(`analyze (level=${this.currentLevel}, rsi=${rsi}, bb={l:${bb.lower}, m:${bb.middle}, u:${bb.upper}})`);

		if (this.hasPosition) {
			this.changeStatusTakingPosition();

			// move takeprofit regarding bb
			await this.updatePositionTakeProfit(bb.middle);
			return;
		}

		// see if we can take position
		if (this.canBuy(rsi, bb)) {
			if (this.waitingMarketStable) {
				return;
			}

			logger.info(`(${this.configuration.name}) Buy (rsi=${rsi}, average candle close=${this.currentLevel}, bb lower=${bb.lower})`);
			await this.takePosition(PositionDirection.BUY, { distance: STOP_LOSS_DISTANCE }, { level: round(bb.middle, 5) });
			return;
		}

		if (this.canSell(rsi, bb)) {
			if (this.waitingMarketStable) {
				return;
			}

			logger.info(`(${this.configuration.name}) Sell (rsi=${rsi}, average candle close=${this.currentLevel}, bb upper=${bb.upper})`);
			await this.takePosition(PositionDirection.SELL, { distance: STOP_LOSS_DISTANCE }, { level: round(bb.middle, 5) });
			return;
		}

		// market is back to stable
		this.waitingMarketStable = false;
		this.changeStatusMarketLookup();
	}

	private canBuy(rsi: number, bb: BollingerBandsOutput) {
		return this.isDiffEnough(bb) && rsi < 30 && this.currentLevel < bb.lower;
	}

	private canSell(rsi: number, bb: BollingerBandsOutput) {
		return this.isDiffEnough(bb) && rsi > 70 && this.currentLevel > bb.upper;
	}

	// do not take position if takeprofit is too close (less than 5 pips)
	private isDiffEnough(bb: BollingerBandsOutput) {
		return Math.abs(this.currentLevel - bb.middle) >= STOP_LOSS_DISTANCE * PIP;
	}
}
