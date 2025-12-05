import { findAmount } from './group-by-period/tools';
import GroupByPeriod from './group-by-period';

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
    type="month"
    exportFilename="group-by-month"
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
