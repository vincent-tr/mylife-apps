import { parse } from 'fecha';
import { DealDirection } from './api/dealing';
import { PositionDirection } from '../position';

export function parseTimestamp(date: number | string): Date {
  if (typeof date === 'string') {
    date = parseInt(date, 10);
  }
  return new Date(date);
}

export function parseISODate(date: string): Date {
  return new Date(date + 'Z');
}

export function parseDate(value: string): Date {
  const result = parse(value, 'YYYY/MM/DD HH:mm:ss');
  return result ? <Date>result : null;
}

export function parseDirection(direction: DealDirection): PositionDirection {
  switch (direction) {
    case null:
      return null;
    case DealDirection.BUY:
      return PositionDirection.BUY;
    case DealDirection.SELL:
      return PositionDirection.SELL;
    default:
      throw new Error(`Unknown direction: '${direction}'`);
  }
}

export function serializeDirection(direction: PositionDirection): DealDirection {
  switch (direction) {
    case null:
      return null;
    case PositionDirection.BUY:
      return DealDirection.BUY;
    case PositionDirection.SELL:
      return DealDirection.SELL;
    default:
      throw new Error(`Unknown direction: '${direction}'`);
  }
}