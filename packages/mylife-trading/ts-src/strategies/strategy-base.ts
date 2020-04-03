import { createLogger } from 'mylife-tools-server';
import Strategy, { Configuration, Listeners } from './strategy';
import { round } from '../utils';
import { Instrument, Credentials, PositionSummary } from '../broker';

const logger = createLogger('mylife:trading:strategy:strategy-base');

export default abstract class StrategyBase implements Strategy {
	private _configuration: Configuration;
	private listeners: Listeners;
	private currentStatus: string;

	protected abstract initImpl(credentials: Credentials): Promise<void>;
	protected abstract terminateImpl(): Promise<void>;

	protected get configuration() {
		return this._configuration;
	}

	async init(configuration: Configuration, credentials: Credentials, listeners: Listeners) {
		this._configuration = configuration;
		logger.debug(`(${this.configuration.name}) init`);
		this.listeners = listeners;
		this.changeStatus('Initialisation');

		try {
			await this.initImpl(credentials);
		} catch (err) {
			logger.error(`(${this.configuration.name}) init error: ${err.stack}`);
			this.fatal(err);
		}
	}

	async terminate() {
		try {
			this.changeStatus("Mise à l'arrêt");
			await this.terminateImpl();
			logger.debug(`(${this.configuration.name}) terminate`);
		} catch (err) {
			logger.error(`(${this.configuration.name}) terminate error: ${err.stack}`);
		}
	}

	protected fatal(err: Error) {
		this.listeners.onFatalError(err);
	}

	protected positionSummary(summary: PositionSummary) {
		this.listeners.onNewPositionSummary(summary);
	}

	protected fireAsync<T>(target: () => Promise<T>) {
		target().catch(err => {
			logger.error(`(${this.configuration.name}) runtime error: ${err.stack}`);
			this.fatal(err);
		});
	}

	protected changeStatus(status: string) {
		if (status === this.currentStatus) {
			return;
		}

		logger.debug(`(${this.configuration.name}) change status: '${status}'`);
		this.currentStatus = status;
		this.listeners.onStatusChanged(status);
	}

	protected changeStatusTakingPosition() {
		this.changeStatus('Prise de position');
	}

	protected changeStatusMarketLookup() {
		this.changeStatus('Surveillance du marché');
	}

	protected computePositionSize(instrument: Instrument, stopLossDistance: number) {
		const riskValue = this.configuration.risk;
		const valueOfOnePip = instrument.valueOfOnePip;
		const exchangeRate = instrument.exchangeRate;
		const valueOfOnePipAccountCurrency = valueOfOnePip / exchangeRate; // convert pip value from market target currency to account currency

		const size = riskValue / (valueOfOnePipAccountCurrency * stopLossDistance);
		return round(size, 2);
	}
}
