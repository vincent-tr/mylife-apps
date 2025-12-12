import { ReportGroupByPeriod } from '../../../api';
import { Serie } from './chart';

export function findAmount(periodItem: ReportGroupByPeriod, serie: Serie) {
  const item = periodItem.groups[serie.stackId];
  if (!item) {
    return 0;
  }

  if (serie.root) {
    return item.amount;
  }

  const childItem = item.children[serie.group];
  if (!childItem) {
    return 0;
  }
  return childItem.amount;
}

export function roundCurrency(value: number) {
  if (!isFinite(value)) {
    return value;
  }
  return Math.round(value * 100) / 100;
}
