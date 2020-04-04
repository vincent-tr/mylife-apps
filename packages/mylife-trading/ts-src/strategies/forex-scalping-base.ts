import { createLogger } from 'mylife-tools-server';
import StrategyBase from './strategy-base';
import { Credentials, Broker, Instrument, createBroker, Market, MarketStatus } from '../broker';
import { fireAsync } from '../utils';

const logger = createLogger('mylife:trading:strategy:forex-scalping-base');

export default abstract class ForexScalpingBase extends StrategyBase {
	private credentials: Credentials;

	private broker: Broker;

	private market: Market;
	private opened: boolean;

	private _instrument: Instrument;

	protected get instrument() {
		return this._instrument;
	}

	protected abstract open(): Promise<void>;
	protected abstract close(): Promise<void>;

	constructor() {
		super();
		this.broker = createBroker('ig');
	}

	async terminate() {
		this.market.close();
		await super.terminate();
	}

	protected async initImpl(credentials: Credentials) {
		this.credentials = credentials;
		this.market = this.broker.getMarket('forex');
		this.market.on('statusChanged', (status) => this.onMarketStatusChanged(status));

		if (this.isMarketOpened()) {
			await this.runOpen();
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

	protected async terminateImpl() {
		this.market.close();
		this.market = null;

		if (this.opened) {
			await this.runClose();
		}
	}

	private async runOpen() {
		this.opened = true;
		try {
			this.changeStatus('Initialisation');

			await this.broker.init(this.credentials);

			this._instrument = await this.broker.getInstrument(this.configuration.epic);

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

			await this.terminateImpl();

			this._instrument.close();
			this._instrument = null;

			await this.broker.terminate();

			logger.debug(`(${this.configuration.name}) terminate`);
			this.changeStatus("En dehors des heures d'ouverture du marché");
		} catch (err) {
			logger.error(`(${this.configuration.name}) terminate error: ${err.stack}`);
			this.fatal(err);
		}
	}
}
