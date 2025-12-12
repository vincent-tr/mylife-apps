import { ReportGroupByPeriod, ReportingCriteria, ReportingDisplay } from '../../api';
import { findAmount } from './group-by-period/tools';
import GroupByPeriod, { AmountSelectorFactoryProps } from './group-by-period';
import { Serie } from './group-by-period/chart';

const initialCriteria: ReportingCriteria = {
  children: false,
  minDate: null,
  maxDate: null,
  account: null,
  groups: [null],
};

const initialDisplay: ReportingDisplay = {
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

function additionalCriteriaFactory(): React.ReactNode {
  return null;
}

function amountSelectorFactory({ display }: AmountSelectorFactoryProps) {
  return (periodItem: ReportGroupByPeriod, serie: Serie) => {
    const value = findAmount(periodItem, serie);
    return display.invert ? -value : value;
  };
}
