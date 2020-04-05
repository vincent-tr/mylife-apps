
export default interface Instrument {
  readonly instrumentId: string;
  readonly valueOfOnePip: number;
  readonly exchangeRate: number;

  close(): void;
}
