import { createLogger } from 'mylife-tools-server';

import { PriceResolution } from './api/market';
import { OpenPositionOrder, OrderType, TimeInForce, DealStatus } from './api/dealing';

import { ConfirmationError, ConfirmationListener } from './confirmation';
import { parseTimestamp, parseDate, parseISODate, serializeDirection } from './parsing';
import { Connection, connectionOpen, connectionClose } from './connection';
import IgPosition from './position';
import IgInstrument from './instrument';

import { Resolution, Credentials, Broker, PositionSummary, OpenPositionBound } from '../broker';
import MovingDataset, { Record, CandleStickData } from '../moving-dataset';
import Position, { PositionDirection } from '../position';
import Instrument from '../instrument';
import Market from '../market';
import IgMarket from './market';
import { getInstrumentRef } from './instrument-ref';

const logger = createLogger('mylife:trading:broker:ig');

interface ResolutionData {
	readonly rest: PriceResolution;
	readonly stream: string;
}

const resolutions = new Map<Resolution, ResolutionData>();
resolutions.set(Resolution.MINUTE, { rest: PriceResolution.MINUTE, stream: '1MINUTE' });
resolutions.set(Resolution.MINUTE_5, { rest: PriceResolution.MINUTE_5, stream: '5MINUTE' });
resolutions.set(Resolution.HOUR, { rest: PriceResolution.HOUR, stream: 'HOUR' });

const datasetSubscriptionFields = [
	'UTM',
	'OFR_OPEN',
	'OFR_HIGH',
	'OFR_LOW',
	'OFR_CLOSE',
	'BID_OPEN',
	'BID_HIGH',
	'BID_LOW',
	'BID_CLOSE' /*,'LTP_OPEN','LTP_HIGH','LTP_LOW','LTP_CLOSE'*/,
	'CONS_END',
];

export class IgBroker implements Broker {
	private connection: Connection;

	getMarket(instrumentId: string): Market {
		const { market } = getInstrumentRef(instrumentId);
		return IgMarket.create(market);
	}

	async init(credentials: Credentials) {
		this.connection = await connectionOpen(credentials);
	}

	async terminate() {
		if (this.connection) {
			await connectionClose(this.connection);
			this.connection = null;
		}
	}

	async getInstrument(instrumentId: string) {
		const { epic } = getInstrumentRef(instrumentId);
		const instrument = new IgInstrument(this.connection.client, epic, instrumentId);
		await instrument.init();
		return instrument;
	}

	async getDataset(instrumentId: string, resolution: Resolution, size: number): Promise<MovingDataset> {
		const { epic } = getInstrumentRef(instrumentId);
		const resolutionData = resolutions.get(resolution);

		const dataset = new MovingDataset(size);
		const prices = await this.connection.client.market.prices(epic, resolutionData.rest, size);
		for (const price of prices.prices) {
			const ask = new CandleStickData(price.openPrice.ask, price.closePrice.ask, price.highPrice.ask, price.lowPrice.ask);
			const bid = new CandleStickData(price.openPrice.bid, price.closePrice.bid, price.highPrice.bid, price.lowPrice.bid);
			dataset.add(new Record(ask, bid, parseDate(price.snapshotTime)));
		}

		const subscription = this.connection.client.subscribe('MERGE', [`CHART:${epic}:${resolutionData.stream}`], datasetSubscriptionFields);
		dataset.on('close', () => subscription.close());
		subscription.on('error', (err) => dataset.emit('error', err));
		subscription.on('update', (data) => {
			const ask = new CandleStickData(data.OFR_OPEN, data.OFR_CLOSE, data.OFR_HIGH, data.OFR_LOW);
			const bid = new CandleStickData(data.BID_OPEN, data.BID_CLOSE, data.BID_HIGH, data.BID_LOW);
			const record = new Record(ask, bid, parseTimestamp(data.UTM));
			if (data.CONS_END) {
				record.fix();
			}

			dataset.add(record);
		});

		return dataset;
	}

	async openPosition(
		instrument: Instrument,
		direction: PositionDirection,
		size: number,
		stopLoss: OpenPositionBound,
		takeProfit: OpenPositionBound
	): Promise<Position> {
		const igInstrument = instrument as IgInstrument;
		const order: OpenPositionOrder = {
			epic: igInstrument.epic,
			expiry: igInstrument.expiry,
			currencyCode: igInstrument.currencyCode,
			direction: serializeDirection(direction),
			dealReference: randomString(),
			limitLevel: takeProfit.level,
			limitDistance: takeProfit.distance,
			stopLevel: stopLoss.level,
			stopDistance: stopLoss.distance,
			size,
			forceOpen: true,
			guaranteedStop: false,
			orderType: OrderType.MARKET,
			timeInForce: TimeInForce.FILL_OR_KILL,
		};

		const confirmationListener = ConfirmationListener.fromConnection(this.connection);
		const dealReference = await this.connection.client.dealing.openPosition(order);
		const confirmation = await confirmationListener.wait(dealReference);

		if (confirmation.dealStatus == DealStatus.REJECTED) {
			throw new ConfirmationError(confirmation.reason);
		}

		const position = new IgPosition(this.connection.client, this.connection.refTradeSubscription(), confirmation, igInstrument.instrumentId);
		position.on('close', () => this.connection.unrefTradeSubscription());

		return position;
	}

	async getPositionSummary(position: Position): Promise<PositionSummary> {
		const history = await this.connection.client.account.accountTransactions();

		// find position
		// DIAAAADGRPS29A7 => ref = GRPS29A7
		const ref = position.dealId.substr(7);

		const transaction = history.transactions.find((transaction) => ref === transaction.reference);
		if (!transaction) {
			throw new Error(`Transaction not found in history for position with dealId='${position.dealId}'`);
		}

		// eg: 'E+5.3'
		const profitAndLoss = transaction.profitAndLoss.substr(transaction.currency.length);

		return {
			instrumentId: position.instrumentId,
			dealId: position.dealId,
			orders: position.orders,
			openDate: parseISODate(transaction.openDateUtc),
			closeDate: parseISODate(transaction.dateUtc),
			openLevel: parseFloat(transaction.openLevel),
			closeLevel: parseFloat(transaction.closeLevel),
			size: parseFloat(transaction.size),
			profitAndLoss: parseFloat(profitAndLoss),
			currency: transaction.currency,
		};
	}
}

function randomString() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
