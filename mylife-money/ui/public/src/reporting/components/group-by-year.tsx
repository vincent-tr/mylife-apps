import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import { CriteriaField } from 'mylife-tools-ui';
import { getGroupByYear, exportGroupByYear } from '../store';
import { findAmount, roundCurrency } from './group-by-period/tools';
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
  monthAverage: false,
};

const AdditionalCriteria = ({ display, onDisplayChanged }) => {
  const setDisplay = (name, value) => onDisplayChanged({ ...display, [name]: value });
  const onMonthAverageChanged = (value) => setDisplay('monthAverage', value);

  return (
    <React.Fragment>
      <Grid size={4}>
        <CriteriaField label="Moyenne par mois">
          <Checkbox color="primary" checked={display.monthAverage} onChange={(e) => onMonthAverageChanged(e.target.checked)} />
        </CriteriaField>
      </Grid>
      <Grid size={8} />
    </React.Fragment>
  );
};

AdditionalCriteria.propTypes = {
  display: PropTypes.object.isRequired,
  onDisplayChanged: PropTypes.func.isRequired,
};

const GroupByYear = () => (
  <GroupByPeriod
    refreshAction={getGroupByYear}
    exportAction={exportGroupByYear}
    initialCriteria={initialCriteria}
    initialDisplay={initialDisplay}
    additionalCriteriaFactory={AdditionalCriteria}
    amountSelectorFactory={amountSelectorFactory}
  />
);

export default GroupByYear;

function amountSelectorFactory({ display }) {
  return (periodItem, serie) => {
    let value = findAmount(periodItem, serie);
    if (display.invert) {
      value = -value;
    }
    if (display.monthAverage) {
      value = roundCurrency(value / 12);
    }
    return value;
  };
}
