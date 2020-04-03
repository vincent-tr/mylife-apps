import { createLogger } from 'mylife-tools-server';

const logger = createLogger('mylife:trading:utils');

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

export function fireAsync<T>(target: () => Promise<T>) {
  target().catch(err => logger.error(`Unhandled promise rejection: ${err.stack}`));
}

export const PIP = 0.0001;