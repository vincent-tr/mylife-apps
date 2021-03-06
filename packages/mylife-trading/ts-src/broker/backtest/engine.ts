import EventEmitter from 'events';
import { createLogger, getService } from 'mylife-tools-server';

import { TestSettings } from '../broker';
import { Record, CandleStickData } from '../moving-dataset';
import { MarketStatus } from '../market';

import { Timeline } from './timeline';
import Cursor, { HistoricalDataItem } from './cursor';
import BacktestMarket from './market';

const logger = createLogger('mylife:trading:broker:backtest:engine');

interface Engine extends EventEmitter {
	on(event: 'error', listener: (error: Error) => void): this;
}

class TickStream {
	private readonly end: Promise<void>;
	private closeFlag = false;

	constructor(private readonly next: () => Promise<void>) {
		this.end = this.run();
	}

	async terminate() {
		this.closeFlag = true;
		await this.end;
	}

	terminateFromInside() {
		this.closeFlag = true;
	}

	private async run() {
		while (!this.closeFlag) {
			await this.next();
		}
	}
}

class Engine extends EventEmitter implements Engine {
	private readonly spread: number;
	public readonly timeline: Timeline;
	private readonly cursor: Cursor;
	private runner: TickStream;
	private readonly pendingPromises = new Set<Promise<void>>();
	private _currentRecord: Record;
	private nextRecord: Record;
	private market: BacktestMarket;

	setMarket(market: BacktestMarket) {
		this.market = market;
	}

	get currentRecord() {
		return this._currentRecord;
	}

	constructor(public readonly configuration: TestSettings) {
		super();

		this.spread = configuration.spread;
		this.timeline = new Timeline(this.configuration.resolution);
		this.cursor = new Cursor(this.configuration.resolution, this.configuration.instrumentId);
	}

	async init() {
		const item = await this.cursor.next();
		const record = createRecord(item, this.spread);

		this._currentRecord = record;
		this.timeline.set(record.timestamp);

		await this.waitAllAsync();

		this.runner = new TickStream(() => this.tick());
	}

	private async tick() {
		try {
			await this.fetchNextRecord();

			const nextRecordTime = this.nextRecord.timestamp.getTime();
			const nextTimeLineTime = this.timeline.nextTick().getTime();

			if (nextRecordTime === nextTimeLineTime) {
				this._currentRecord = this.nextRecord;
				this.nextRecord = null;
				this.timeline.increment();
			} else if (nextRecordTime < nextTimeLineTime) {
				logger.warn(`Unexpected record: ${this.nextRecord.timestamp.toISOString()}`);
				this.nextRecord = null;
			} else {
				// nextRecordTime > nextTimeLineTime
				this.timeline.increment();
				if (this.market.status !== MarketStatus.CLOSED) {
					logger.warn(`Missing record: ${this.timeline.current.toISOString()}`);
				}
			}

			await this.waitAllAsync();
		} catch (err) {
			this.emit('error', err);
		}
	}

	private async fetchNextRecord() {
		if (this.nextRecord) {
			return;
		}

		const item = await this.cursor.next();

		if (!item) {
			this.runner.terminateFromInside();
			throw new Error('No more data');
		}

		this.nextRecord = createRecord(item, this.spread);
	}

	async terminate() {
		await this.runner.terminate();
		await this.waitAllAsync();
		await this.cursor.close();
	}

	fireAsync(target: () => Promise<void>): void {
		const deferred = createDeferred<void>();
		this.pendingPromises.add(deferred.promise);

		target()
			.catch((err) => logger.error(`Unhandled promise rejection: ${err.stack}`))
			.finally(() => {
				this.pendingPromises.delete(deferred.promise);
				deferred.resolve();
			});
	}

	private async waitAllAsync() {
		const pendings = Array.from(this.pendingPromises);
		await Promise.all(pendings);

		// don't let the store task queue grow too much with stats inserts
		const taskQueueManager = getService('task-queue-manager');
		await Promise.all([taskQueueManager.getQueue('store').waitEmpty(), taskQueueManager.getQueue('io').waitEmpty()]);
	}
}

export default Engine;

interface Deferred<T> {
	readonly promise: Promise<T>;
	readonly resolve: (value: T) => void;
	readonly reject: (err: Error) => void;
}

function createDeferred<T>(): Deferred<T> {
	let resolve: (value: T) => void;
	let reject: (err: Error) => void;

	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { promise, resolve, reject };
}

function createRecord(item: HistoricalDataItem, spread: number) {
	// spread = ask - bid, let's consider half above/half below
	const diff = spread / 2;
	const ask = createCandleStick(item, diff);
	const bid = createCandleStick(item, -diff);

	const record = new Record(ask, bid, item.date);
	record.fix();
	return record;
}

function createCandleStick(item: HistoricalDataItem, diff: number) {
	return new CandleStickData(item.open + diff, item.close + diff, item.high + diff, item.low + diff);
}
