export function last<T>(array: T[]): T {
  const lastIndex = array.length - 1;
  return lastIndex === -1 ? null : array[lastIndex];
}

export function average(...values: number[]): number {
  if (!values.length) {
    return NaN;
  }

  const sum = values.reduce((prev, cur) => prev + cur, 0);
  return sum / values.length;
}

export function round(value: number, decimalCount: number) {
  const factor = Math.pow(10, decimalCount);
  return Math.round(factor * value) / factor;
}