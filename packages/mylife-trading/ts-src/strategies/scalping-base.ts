import { createLogger } from 'mylife-tools-server';
import StrategyBase from './strategy-base';
import { Instrument, Market, MarketStatus, MovingDataset, Record, Resolution, Position, PositionDirection, OpenPositionBound, PositionCloseReason } from '../broker';
import { last, PIP } from '../utils';

const logger = createLogger('mylife:trading:strategy:scalping-base');

export default abstract class ScalpingBase extends StrategyBase {
	private market: Market;
	private opened: boolean;

	private _instrument: Instrument;
	private _closing = false;

	private dataset: MovingDataset;
	private _datasetRecords: Record[];
	private _currentLevel: number;
	private lastProcessedTimestamp: number;
	private position: Position;

	protected get instrument() {
		return this._instrument;
	}

	protected get closing() {
		return this._closing;
	}

	protected get datasetRecords() {
		return this._datasetRecords;
	}

	protected get currentLevel() {
		return this._currentLevel;
	}

	protected get hasPosition() {
		return !!this.position;
	}

	protected get positionDirection() {
		return this.position ? this.position.direction : null;
	}

	protected abstract readonly datasetResolution: Resolution;
	protected abstract readonly datasetSize: number;

	protected abstract analyze(): Promise<void>;

	protected async open() {
		this.dataset = await this.broker.getDataset(this.instrument.instrumentId, this.datasetResolution, this.datasetSize);
		this.dataset.on('add', () => this.onDatasetChange());
		this.dataset.on('update', () => this.onDatasetChange());

		this.onDatasetChange();
	}

	protected async close() {
		if (this.position) {
			await this.position.close(PositionCloseReason.EXITING);
		}

		if (this.dataset) {
			this.dataset.close();
		}
	}

	private onDatasetChange() {
		if (!this.shouldRun()) {
			return;
		}

		this._datasetRecords = this.dataset.fixedList;
		const candle = last(this._datasetRecords);
		this._currentLevel = candle.average.close;

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

	protected async takePosition(direction: PositionDirection, stopLoss: OpenPositionBound, takeProfit: OpenPositionBound) {
		// convert risk value to contract size
		const stopLossDistance = stopLoss.distance || Math.abs(this.currentLevel - stopLoss.level) / PIP;
		const size = this.computePositionSize(this.instrument, stopLossDistance);

		this.position = await this.broker.openPosition(this.instrument, direction, size, stopLoss, takeProfit);
		this.changeStatusTakingPosition();

		this.position.on('close', () => {
			const position = this.position;
			this.position = null;

			this.fireAsync(async () => {
				const summary = await this.broker.getPositionSummary(position);
				logger.info(`(${this.configuration.name}) Position closed: ${JSON.stringify(summary)}`);

				this.positionSummary(summary);

				if (this.closing) {
					return;
				}

				this.changeStatusMarketLookup();
			});
		});
	}

	protected async closePosition() {
		await this.position.close(PositionCloseReason.NORMAL);
	}

	protected async updatePositionTakeProfit(value: number) {
		await this.position.updateTakeProfit(value);
	}

	protected async initImpl() {
		this.market = await this.broker.getMarket(this.configuration.instrumentId);
		this.market.on('statusChanged', (status) => this.onMarketStatusChanged(status));

		if (this.isMarketOpened()) {
			await this.runOpen();
		} else {
			this.changeStatusMarketClosed();
		}
	}

	private isMarketOpened() {
		return this.market.status === MarketStatus.OPENED;
	}

	private onMarketStatusChanged(status: MarketStatus) {
		if (this.isMarketOpened() === this.opened) {
			return;
		}

		if (this.opened) {
			this.fireAsync(() => this.runClose());
		} else {
			this.fireAsync(() => this.runOpen());
		}
	}

	private changeStatusMarketClosed() {
		this.changeStatus("En dehors des heures d'ouverture du marché");
	}

	protected async terminateImpl() {
		if (this.market) {
			await this.market.close();
			this.market = null;
		}

		if (this.opened) {
			await this.runClose();
		}
	}

	private async runOpen() {
		this.opened = true;
		try {
			this.changeStatus('Initialisation');

			await this.broker.init();

			this._instrument = await this.broker.getInstrument(this.configuration.instrumentId);

			await this.open();
		} catch (err) {
			logger.error(`(${this.configuration.name}) init error: ${err.stack}`);
			this.fatal(err);
		}
	}

	private async runClose() {
		this.opened = false;
		try {
			this.changeStatus("Mise à l'arrêt");

			this._closing = true;
			try {
				await this.close();
			} catch(err) {
				logger.error(`Stop failure: ${err.stack}`);
			}
			this._closing = false;

			this._instrument.close();
			this._instrument = null;

			await this.broker.terminate();

			logger.debug(`(${this.configuration.name}) terminate`);
			this.changeStatusMarketClosed();
		} catch (err) {
			logger.error(`(${this.configuration.name}) terminate error: ${err.stack}`);
			this.fatal(err);
		}
	}
}
