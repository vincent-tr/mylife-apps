
export default interface Instrument {
  readonly instrumentId: string;
  readonly exchangeRate: number;

  close(): void;
}
