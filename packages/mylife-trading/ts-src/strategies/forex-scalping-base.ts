import { createLogger } from 'mylife-tools-server';
import StrategyBase from './strategy-base';
import { Credentials } from '../broker';

const logger = createLogger('mylife:trading:strategy:forex-scalping-base');

export default abstract class ForexScalpingBase extends StrategyBase {
	private credentials: Credentials;
	private opened: boolean;
	private timer: NodeJS.Timer;

	protected abstract open(credentials: Credentials): Promise<void>;
	protected abstract close(): Promise<void>;

	protected async initImpl(credentials: Credentials) {
		this.credentials = credentials;
		this.timer = setInterval(() => this.onInterval(), 60 * 1000);

		if (isOpen()) {
			await this.runOpen();
		}
	}

	private onInterval() {
		if (isOpen() === this.opened) {
			return;
		}

		if (this.opened) {
			this.fireAsync(() => this.runClose());
		} else {
			this.fireAsync(() => this.runOpen());
		}
	}

	protected async terminateImpl() {
		clearInterval(this.timer);
		this.timer = null;

		if (this.opened) {
			await this.runClose();
		}
	}

	private async runOpen() {
		this.opened = true;
		try {
			this.changeStatus('Initialisation');
			await this.open(this.credentials);
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
			logger.debug(`(${this.configuration.name}) terminate`);
			this.changeStatus("En dehors des heures d'ouverture du marché");
		} catch (err) {
			logger.error(`(${this.configuration.name}) terminate error: ${err.stack}`);
			this.fatal(err);
		}
	}
}

// https://admiralmarkets.com/fr/formation/articles/base-du-forex/horaire-bourse
// Les horaire du forex sont de dimanche soir 23h heure de Paris à vendredi 22H heure de Paris

// close 1 hour before, and open 1 hour later
// Sunday - Saturday : 0 - 6

const SUNDAY = 0;
const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;

const OPEN_DAYS = new Set([MONDAY, TUESDAY, WEDNESDAY, THURSDAY]);

function isOpen(): boolean {
	const now = new Date();
	const day = now.getDay();

	if (day === FRIDAY) {
		// ok until 21h
		return now.getHours() < 21;
	}

	return OPEN_DAYS.has(day);
}
