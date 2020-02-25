export function last<T>(array: T[]): T {
  const lastIndex = array.length - 1;
  return lastIndex === -1 ? null : array[lastIndex];
}

export function average(...values: number[]): number {
  if(!values.length) {
    return NaN;
  }

  const sum = values.reduce((prev, cur) => prev + cur, 0);
  return sum / values.length;
}