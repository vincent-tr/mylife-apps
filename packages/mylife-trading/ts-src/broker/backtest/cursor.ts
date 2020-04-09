import { getService, getMetadataEntity } from 'mylife-tools-server';
import { Resolution } from '../broker';

export interface HistoricalDataItem {
	readonly instrumentId: string;
	readonly resolution: Resolution;
	readonly date: Date;
	readonly open: number;
	readonly close: number;
	readonly high: number;
	readonly low: number;
}

export default class Cursor {
	private readonly entity: any;
	private readonly store: any;
	private readonly cursor: any;

	constructor(resolution: Resolution, instrumentId: string) {
		const database = getService('database');
		const collection = database.collection('historical-data');

		const query = { resolution: resolution, instrumentId: instrumentId };
		const sort = [['date', 1]];
		this.cursor = collection.find(query, { sort });

		this.store = getService('store');
		this.entity = getMetadataEntity('historical-data');
	}

	async close() {
		await this.cursor.close();
	}

	async next(): Promise<HistoricalDataItem> {
		const record = await this.cursor.next();
		if (!record) {
			return null;
		}
		
		return this.store.deserializeObject(record, this.entity) as HistoricalDataItem;
	}
}
