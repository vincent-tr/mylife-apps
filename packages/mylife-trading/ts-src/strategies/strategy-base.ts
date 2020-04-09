import { createLogger } from 'mylife-tools-server';
import Strategy, { StrategyConfiguration, Listeners } from './strategy';
import { round, PIP } from '../utils';
import { Instrument, Credentials, PositionSummary, Broker, createBroker } from '../broker';

const logger = createLogger('mylife:trading:strategy:strategy-base');

export default abstract class StrategyBase implements Strategy {
	private _configuration: StrategyConfiguration;
	private _broker: Broker;
	private listeners: Listeners;
	private currentStatus: string;

	protected abstract initImpl(): Promise<void>;
	protected abstract terminateImpl(): Promise<void>;

	protected get configuration() {
		return this._configuration;
	}

	protected get broker() {
		return this._broker;
	}

	async init(configuration: StrategyConfiguration, listeners: Listeners) {
		this._configuration = configuration;
		this._broker = createBroker(configuration.broker);
		
		logger.debug(`(${this.configuration.name}) init`);
		this.listeners = listeners;
		this.changeStatus('Initialisation');

		try {
			await this.initImpl();
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

	protected fireAsync(target: () => Promise<void>) {

		const wrappedTarget = async () => {
			try {
				await target();
			} catch(err) {
				logger.error(`(${this.configuration.name}) runtime error: ${err.stack}`);
				this.fatal(err);
			}
		};

		this.broker.fireAsync(wrappedTarget);
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
		const exchangeRate = instrument.exchangeRate;
		const valueOfOnePipAccountCurrency = PIP * instrument.contractSize / exchangeRate; // convert pip value from market target currency to account currency

		const size = riskValue / (valueOfOnePipAccountCurrency * stopLossDistance);
		return round(size, 2);
	}
}
