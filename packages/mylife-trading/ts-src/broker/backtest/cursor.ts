import { createLogger, getService } from 'mylife-tools-server';
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
	private readonly service: any;
	private readonly cursor: any;

	constructor(resolution: Resolution, instrumentId: string) {
		this.service = getService('database');
		const collection = this.service.collection('historical-data');

		const query = { resolution: resolution, instrumentId: instrumentId };
		const sort = [['date', 1]];
		this.cursor = collection.find(query, { sort });
	}

	async close() {
		await this.cursor.close();
	}

	async next(): Promise<HistoricalDataItem> {
		const record = await this.cursor.next();
		if (!record) {
			return null;
		}
		return this.service.deserializeObject(record) as HistoricalDataItem;
	}
}
