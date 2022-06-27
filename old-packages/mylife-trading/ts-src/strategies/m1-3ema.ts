import { EMA } from 'technicalindicators';
import { createLogger } from 'mylife-tools-server';
import { Resolution, MovingDataset, Position, PositionDirection, PositionCloseReason } from '../broker';
import { last, PIP } from '../utils';
import ScalpingBase from './scalping-base';

const logger = createLogger('mylife:trading:strategy:m1-3ema');

// https://www.forexstrategiesresources.com/trend-following-forex-strategies/70-3ema-s/

export default class M13Ema extends ScalpingBase {
	protected readonly datasetResolution = Resolution.M1;
	protected readonly datasetSize = 150;

	private getEma(values: number[], period: number) {
		const ema = EMA.calculate({ period, values });
		return ema.slice(-2);
	}

	private getIndicators() {

		const values = this.datasetRecords.map(record => record.average.close);
		const ema1 = this.getEma(values, 3);
		const ema2 = this.getEma(values, 13);
		const ema3 = this.getEma(values, 144);

		const lasts = this.datasetRecords.slice(-5);
		const lastLows = Math.min(...lasts.map(record => record.average.low));
		const lastHighs = Math.max(...lasts.map(record => record.average.high));

		return { ema1, ema2, ema3, lastLows, lastHighs };
	}

	private async checkPositionClose() {
		const { ema1, ema2 } = this.getIndicators();

		// close when em1 and em2 cross again
		const shouldClose = this.positionDirection === PositionDirection.BUY ? ema1[1] < ema2[1] : ema1[1] > ema2[1];
		if (shouldClose) {
			logger.info(`(${this.configuration.name}) Close (direction=${this.positionDirection}, ema1=${JSON.stringify(ema1)}, ema2=${JSON.stringify(ema2)})`);
			await this.closePosition();
		}
	}

	protected async analyze() {
		if (this.hasPosition) {
			await this.checkPositionClose();
			return;
		}

		this.changeStatusMarketLookup();

		const { ema1, ema2, ema3, lastLows, lastHighs } = this.getIndicators();
		logger.debug(`analyze (level=${this.currentLevel}, ema1=${JSON.stringify(ema1)}, ema2=${JSON.stringify(ema2)}, ema3=${JSON.stringify(ema3)})`);

		// see if we can take position
		if (this.canBuy(ema1, ema2, ema3)) {
			logger.info(`(${this.configuration.name}) Buy (level=${this.currentLevel}, stopLoss=${lastLows}, ema1=${JSON.stringify(ema1)}, ema2=${JSON.stringify(ema2)}, ema3=${JSON.stringify(ema3)})`);
			await this.takePosition(PositionDirection.BUY, { level: lastLows }, {});
			return;
		}

		if (this.canSell(ema1, ema2, ema3)) {
			logger.info(`(${this.configuration.name}) Sell (level=${this.currentLevel}, stopLoss=${lastHighs}, ema1=${JSON.stringify(ema1)}, ema2=${JSON.stringify(ema2)}, ema3=${JSON.stringify(ema3)})`);
			await this.takePosition(PositionDirection.SELL, { level: lastHighs }, {});
			return;
		}
	}

	private canBuy(ema1: number[], ema2: number[], ema3: number[]) {
		// price above all
		if (this.currentLevel <= ema1[1] || this.currentLevel <= ema2[1] || this.currentLevel <= ema3[1]) {
			return false;
		}

		// ema1 and 2 above ema3
		if (ema1[0] <= ema3[0] || ema1[1] <= ema3[1] || ema2[0] <= ema3[0] || ema2[1] <= ema3[1]) {
			return false;
		}

		// ema1 cross ema2 to upper
		return ema1[0] < ema2[0] && ema1[1] > ema2[1];
	}

	private canSell(ema1: number[], ema2: number[], ema3: number[]) {
		// price below all
		if (this.currentLevel >= ema1[1] || this.currentLevel >= ema2[1] || this.currentLevel >= ema3[1]) {
			return false;
		}

		// ema1 and 2 below ema3
		if (ema1[0] >= ema3[0] || ema1[1] >= ema3[1] || ema2[0] >= ema3[0] || ema2[1] >= ema3[1]) {
			return false;
		}

		// ema1 cross ema2 to lower
		return ema1[0] > ema2[0] && ema1[1] < ema2[1];
	}

}
