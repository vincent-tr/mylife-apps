export interface InstrumentRef {
	market: string;
	epic: string;
}

interface epicFactory {
	(instrumentPart: string): string;
}

const markets = new Map<string, epicFactory>();
markets.set('forex', (instrumentPart) => `CS.D.${instrumentPart.toUpperCase()}.MINI.IP`);

export function getInstrumentRef(instrumentId: string) {
	const [market, instrumentPart] = instrumentId.split(':');
	if (!market || !instrumentPart) {
		throw new Error(`Malformed instrument id: '${instrumentId}'`);
	}

	const factory = markets.get(market);
	if (!factory) {
		throw new Error(`Unknown market in instrument id: '${instrumentId}'`);
	}

	const epic = factory(instrumentPart);
	return { market, epic };
}
