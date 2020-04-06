import EventEmitter from 'events';
import Market, { MarketStatus } from '../market';

interface MarketParams {
	readonly refreshInterval: number;
	readonly getStatus: () => MarketStatus;
}

const markets = new Map<string, MarketParams>();

export default class IgMarket extends EventEmitter implements Market {
	private readonly getStatus: () => MarketStatus;
	private readonly timer: NodeJS.Timer;
	private _status: MarketStatus;

	public get status() {
		return this._status;
	}

	constructor(params: MarketParams) {
		super();
		this.getStatus = params.getStatus;
		this.timer = setInterval(() => this.refreshMarketStatus(), params.refreshInterval);
		this.refreshMarketStatus();
	}

	close() {
		clearInterval(this.timer);
	}

	private refreshMarketStatus() {
		const status = this.getStatus();
		if (status === this._status) {
			return;
		}

		this._status = status;
		this.emit('statusChanged', status);
	}

	static create(market: string): IgMarket {
		const params = markets.get(market);
		if (!params) {
			throw new Error(`Unknown market: '${market}'`);
		}

		return new IgMarket(params);
	}
}

const MINUTE = 60 * 1000;

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

function getForexStatus(): MarketStatus {
	const now = new Date();
	const day = now.getDay();

	if (day === FRIDAY) {
		if (now.getHours() < 21) {
			return MarketStatus.OPENED;
		}
		if (now.getHours() < 22) {
			return MarketStatus.CLOSING_SOON;
		}
	}

	if (day === SUNDAY && now.getHours() >= 23) {
		return MarketStatus.OPENED_RECENTLY;
	}

	return OPEN_DAYS.has(day) ? MarketStatus.OPENED : MarketStatus.CLOSED;
}

markets.set('forex', { refreshInterval: MINUTE, getStatus: getForexStatus });
