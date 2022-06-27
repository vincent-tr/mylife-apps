import Instrument from '../instrument';

export default class BacktestInstrument implements Instrument {

	constructor(readonly instrumentId: string) {
	}

	get contractSize() {
		// mini
		return 10000;
	}

	get exchangeRate() {
		// only used to compute lot size, we don't care for now
		return 1;
	}

	close() {
		// nothing to do
	}
}
