import { SMA, Stochastic } from 'technicalindicators';
import { createLogger } from 'mylife-tools-server';
import { Resolution, MovingDataset, Position, PositionDirection, PositionCloseReason } from '../broker';
import { analyzeTrend, last } from '../utils';
import ScalpingBase from './scalping-base';

const logger = createLogger('mylife:trading:strategy:m1-sma-stochastic');

const STOP_LOSS_DISTANCE = 20;
const TAKE_PROFIT_DISTANCE = 10;

export default class M1SmaStochastic extends ScalpingBase {
	protected readonly datasetResolution = Resolution.M1;
	protected readonly datasetSize = 1020;

	private getIndicators() {
		const values = this.datasetRecords.map(record => record.average.close);
		const sma = SMA.calculate({ period: 1000, values: values });
		const trend = analyzeTrend(sma);

		const lasts = this.datasetRecords.slice(-30);
		const stochasticRaw = Stochastic.calculate({
			high: lasts.map(record => record.average.high),
			low: lasts.map(record => record.average.low),
			close: lasts.map(record => record.average.close),
			period: 14,
			signalPeriod: 3
		});
		const stochastic = stochasticRaw.slice(-2).map(item => item.k);

		return { sma: last(sma), trend, stochastic };
	}

	protected async analyze() {
		if (this.hasPosition) {
			return;
		}

		this.changeStatusMarketLookup();

		const { sma, trend, stochastic } = this.getIndicators();
		logger.debug(`analyze (level=${this.currentLevel}, trend=${trend}, sma=${sma}, stochastic=${JSON.stringify(stochastic)})`);

		// see if we can take position
		if (this.canBuy(sma, trend, stochastic)) {
			logger.info(`(${this.configuration.name}) Buy (level=${this.currentLevel}, trend=${trend}, sma=${sma}, stochastic=${JSON.stringify(stochastic)})`);
			await this.takePosition(PositionDirection.BUY, { distance: STOP_LOSS_DISTANCE }, { distance: TAKE_PROFIT_DISTANCE });
			return;
		}

		if (this.canSell(sma, trend, stochastic)) {
			logger.info(`(${this.configuration.name}) Sell (level=${this.currentLevel}, trend=${trend}, sma=${sma}, stochastic=${JSON.stringify(stochastic)})`);
			await this.takePosition(PositionDirection.SELL, { distance: STOP_LOSS_DISTANCE }, { distance: TAKE_PROFIT_DISTANCE });
			return;
		}
	}

	private canBuy(sma: number, trend: number, stochastic: number[]) {
		return trend === 1 && this.currentLevel > sma && stochastic[0] < 20 && stochastic[1] > 20;
	}

	private canSell(sma: number, trend: number, stochastic: number[]) {
		return trend === -1 && this.currentLevel < sma && stochastic[0] > 80 && stochastic[1] < 80;
	}
}
