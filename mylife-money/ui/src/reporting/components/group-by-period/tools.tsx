export function findAmount(periodItem, serie) {
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

export function formatCriteria(criteria) {
  const { fullnames, ...props } = criteria;
  void fullnames;
  return props;
}

export function roundCurrency(value: number) {
  if (!isFinite(value)) {
    return value;
  }
  return Math.round(value * 100) / 100;
}
