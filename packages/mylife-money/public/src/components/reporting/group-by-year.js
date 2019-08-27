'use strict';

import { React, PropTypes, immutable, mui } from 'mylife-tools-ui';
import { getGroupByYear, exportGroupByYear } from '../../actions/reporting';
import GroupByPeriod from './group-by-period';
import { findAmount, roundCurrency } from './group-by-period/tools';
import Field from './common/field';

const initialCriteria = {
  children: false,
  minDate: null,
  maxDate: null,
  account: null,
  groups: new immutable.List([ null ])
};

const initialDisplay = {
  invert: true,
  fullnames: false,
  monthAverage: false
};

const AdditionalCriteria = ({ display, onDisplayChanged }) => {
  const setDisplay = (name, value) => onDisplayChanged({ ...display, [name]: value });
  const onMonthAverageChanged = (value) => setDisplay('monthAverage', value);

  return (
    <React.Fragment>
      <mui.Grid item xs={4}>
        <Field label='Moyenne par mois'>
          <mui.Checkbox color='primary' checked={display.monthAverage} onChange={e => onMonthAverageChanged(e.target.checked)} />
        </Field>
      </mui.Grid>
      <mui.Grid item xs={8} />
    </React.Fragment>
  );
};

AdditionalCriteria.propTypes = {
  display: PropTypes.object.isRequired,
  onDisplayChanged: PropTypes.func.isRequired
};

const GroupByYear = () => (
  <GroupByPeriod
    refreshAction={getGroupByYear}
    exportAction={exportGroupByYear}
    initialCriteria={initialCriteria}
    initialDisplay={initialDisplay}
    additionalCriteriaFactory={AdditionalCriteria}
    amountSelectorFactory={amountSelectorFactory}
    periodKey='year' />
);

export default GroupByYear;

function amountSelectorFactory({ display }) {
  return (periodItem, serie) => {
    let value = findAmount(periodItem, serie);
    if(display.invert) {
      value = -value;
    }
    if(display.monthAverage) {
      value = roundCurrency(value / 12);
    }
    return value;
  };
}
