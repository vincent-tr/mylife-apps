import EventEmitter from 'events';
import Instrument from '../instrument';
import Client from './api/client';
import { fireAsync } from '../../utils';

const INSTRUMENT_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 mins

export default class IgInstrument extends EventEmitter implements Instrument {
	private _expiry: string;
	private _valueOfOnePip: number;
	private _exchangeRate: number;
	private _currencyCode: string;
	private timer: NodeJS.Timer;

	get expiry() {
		return this._expiry;
	}

	get valueOfOnePip() {
		return this._valueOfOnePip;
	}

	get exchangeRate() {
		return this._exchangeRate;
	}

	get currencyCode() {
		return this._currencyCode;
	}

	constructor(private readonly client: Client, readonly epic: string, readonly instrumentId: string) {
		super();
	}

	async init() {
		await this.refresh();

		this.timer = setInterval(() => fireAsync(()=>this.refresh()), INSTRUMENT_REFRESH_INTERVAL);
	}

	close() {
    clearInterval(this.timer);
	}
	
	private async refresh() {
		const { instrument } = await this.client.market.getMarket(this.epic);
		this._expiry = instrument.expiry;
		this._valueOfOnePip = parseFloat(instrument.valueOfOnePip);
		this._exchangeRate = instrument.currencies[0].baseExchangeRate;
		this._currencyCode = instrument.currencies[0].code;
	}
}
