export default class MovingDataset {
  readonly open: number[] = [];
  readonly close: number[] = [];
  readonly high: number[] = [];
  readonly low: number[] = [];

  constructor(private readonly maxSize: number) {}

  add(open: number, close: number, high: number, low: number) {
    this.open.push(open);
    this.close.push(close);
    this.high.push(high);
    this.low.push(low);

    if (this.open.length > this.maxSize) {
      this.open.shift();
      this.close.shift();
      this.high.shift();
      this.low.shift();
    }
  }
}
