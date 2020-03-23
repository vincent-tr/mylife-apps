import { parse } from 'fecha';

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
