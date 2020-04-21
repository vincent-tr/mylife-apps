import { createLogger } from 'mylife-tools-server';
import StrategyBase from './strategy-base';
import { Instrument, Market, MarketStatus } from '../broker';

const logger = createLogger('mylife:trading:strategy:scalping-base');

export default abstract class ScalpingBase extends StrategyBase {
	private market: Market;
	private opened: boolean;

	private _instrument: Instrument;

	protected get instrument() {
		return this._instrument;
	}

	protected abstract open(): Promise<void>;
	protected abstract close(): Promise<void>;

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

			await this.close();

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
