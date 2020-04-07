import EventEmitter from 'events';

export enum MarketStatus {
	OPENED = 'opened',
	OPENED_RECENTLY = 'opened-recently',
	CLOSED = 'closed',
	CLOSING_SOON = 'closing-soon',
}

export default interface Market extends EventEmitter {
	readonly status: MarketStatus;

	on(event: 'statusChanged', listener: (status: MarketStatus) => void): this;

	close(): Promise<void>;
}
