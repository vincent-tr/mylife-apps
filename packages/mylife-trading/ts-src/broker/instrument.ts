
export default interface Instrument {
  readonly instrumentId: string;
  readonly exchangeRate: number;
  readonly contractSize: number;

  close(): void;
}
