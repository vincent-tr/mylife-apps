import Instrument from '../instrument';
import { InstrumentDetails } from './api/market';

export default class IgInstrument implements Instrument {
  readonly epic: string;
  readonly  expiry: string;
  readonly valueOfOnePip: number;
  readonly exchangeRate: number;
  readonly currencyCode: string;

  constructor(data: InstrumentDetails) {
    this.epic = data.epic;
    this.expiry = data.expiry
    this.valueOfOnePip = parseFloat(data.valueOfOnePip);
    this.exchangeRate = data.currencies[0].baseExchangeRate;
    this.currencyCode = data.currencies[0].code;
  }
}
