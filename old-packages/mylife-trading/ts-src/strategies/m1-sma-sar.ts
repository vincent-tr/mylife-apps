import { SMA, PSAR } from 'technicalindicators';
import { createLogger } from 'mylife-tools-server';
import { Resolution, MovingDataset, Position, PositionDirection, PositionCloseReason } from '../broker';
import { last } from '../utils';
import ScalpingBase from './scalping-base';

const logger = createLogger('mylife:trading:strategy:m1-sma-sar');

// https://forexexperts.net/index.php/trade-strategy/scalping-strategies/62-hit-run-scalping-trading
const STOP_LOSS_DISTANCE = 15;
const TAKE_PROFIT_DISTANCE = 10;

export default class M1SmaSar extends ScalpingBase {
	protected readonly datasetResolution = Resolution.M1;
	protected readonly datasetSize = 52;

	private getIndicators() {
		const values = this.datasetRecords.map(record => record.average.close);
		const sma = SMA.calculate({ period: 50, values: values });

		const lasts = this.datasetRecords.slice(-30);
		const sarRaw = PSAR.calculate({
			high: lasts.map(record => record.average.high),
			low: lasts.map(record => record.average.low),
			step: 0.02,
			max: 0.2
		});
		const sar = sarRaw.slice(-2);

		return { sma: last(sma), sar };
	}

	protected async analyze() {
		if (this.hasPosition) {
			return;
		}

		this.changeStatusMarketLookup();

		const { sma, sar } = this.getIndicators();
		logger.debug(`analyze (level=${this.currentLevel}, sma=${sma}, sar=${JSON.stringify(sar)})`);

		// see if we can take position
		if (this.canBuy(sma, sar)) {
			logger.info(`(${this.configuration.name}) Buy (level=${this.currentLevel}, sma=${sma}, sar=${JSON.stringify(sar)})`);
			await this.takePosition(PositionDirection.BUY, { distance: STOP_LOSS_DISTANCE }, { distance: TAKE_PROFIT_DISTANCE });
			return;
		}

		if (this.canSell(sma, sar)) {
			logger.info(`(${this.configuration.name}) Sell (level=${this.currentLevel}, sma=${sma}, sar=${JSON.stringify(sar)})`);
			await this.takePosition(PositionDirection.SELL, { distance: STOP_LOSS_DISTANCE }, { distance: TAKE_PROFIT_DISTANCE });
			return;
		}
	}

	private canBuy(sma: number, sar: number[]) {
		return this.currentLevel > sma && sar[0] > this.currentLevel && sar[1] < this.currentLevel;
	}

	private canSell(sma: number, sar: number[]) {
		return this.currentLevel < sma && sar[0] < this.currentLevel && sar[1] > this.currentLevel;
	}

}
