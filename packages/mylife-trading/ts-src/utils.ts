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

// 1 = up, -1 = down, 0 = unknown
export function analyzeTrend(values: number[]) {
  let result = 0;

  for (let i = 0; i < values.length - 1; ++i) {
    const comparison = compare(values[i], values[i + 1]);
    if (!comparison) {
      continue;
    }

    if (!result) {
      result = comparison;
      continue;
    }

    if (result !== comparison) {
      return 0;
    }
  }

  return result;
}

function compare(val1: number, val2: number) {
  if (val1 < val2) {
    return 1;
  }
  if (val1 > val2) {
    return -1;
  }
  return 0;
}