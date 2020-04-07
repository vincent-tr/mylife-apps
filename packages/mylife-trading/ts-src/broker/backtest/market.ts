import EventEmitter from 'events';
import Market, { MarketStatus } from '../market';
import Engine from './engine';
import { Timeline } from './timeline';

interface MarketParams {
	readonly refreshInterval: number;
	readonly getStatus: (now: Date) => MarketStatus;
}

const markets = new Map<string, MarketParams>();

export default class BacktestMarket extends EventEmitter implements Market {
	private readonly timelineChange = () => this.refreshMarketStatus();
	private readonly getStatus: (now: Date) => MarketStatus;
	private _status: MarketStatus;

	public get status() {
		return this._status;
	}

	constructor(private readonly timeline: Timeline, params: MarketParams) {
		super();
		this.getStatus = params.getStatus;
		this.timeline.on('change', this.timelineChange);
		this.refreshMarketStatus();
	}

	close() {
		this.timeline.removeListener('change', this.timelineChange);
		this.emit('close');
	}

	private refreshMarketStatus() {
		const status = this.getStatus(this.timeline.current);
		if (status === this._status) {
			return;
		}

		this._status = status;
		this.emit('statusChanged', status);
	}

	static create(engine: Engine, market: string): BacktestMarket {
		const params = markets.get(market);
		if (!params) {
			throw new Error(`Unknown market: '${market}'`);
		}

		return new BacktestMarket(engine.timeline, params);
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

function getForexStatus(now: Date): MarketStatus {
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
