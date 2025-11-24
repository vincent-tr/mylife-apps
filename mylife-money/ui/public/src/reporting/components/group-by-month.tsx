import React from 'react';

import { getGroupByMonth, exportGroupByMonth } from '../store';
import GroupByPeriod from './group-by-period';
import { findAmount } from './group-by-period/tools';

const initialCriteria = {
  children: false,
  minDate: null,
  maxDate: null,
  account: null,
  groups: [null],
};

const initialDisplay = {
  invert: true,
  fullnames: false,
};

const GroupByMonth = () => (
  <GroupByPeriod
    refreshAction={getGroupByMonth}
    exportAction={exportGroupByMonth}
    initialCriteria={initialCriteria}
    initialDisplay={initialDisplay}
    additionalCriteriaFactory={additionalCriteriaFactory}
    amountSelectorFactory={amountSelectorFactory}
  />
);

export default GroupByMonth;

function additionalCriteriaFactory() {
  return null;
}

function amountSelectorFactory({ display }) {
  return (periodItem, serie) => {
    const value = findAmount(periodItem, serie);
    return display.invert ? -value : value;
  };
}
