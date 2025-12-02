import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import React from 'react';
import { CriteriaField } from 'mylife-tools';
import { findAmount, roundCurrency } from './group-by-period/tools';
import GroupByPeriod from './group-by-period';

type FIXME_any = any;

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

interface AdditionalCriteriaProps {
  display;
  onDisplayChanged: (display) => void;
}

function AdditionalCriteria({ display, onDisplayChanged }: AdditionalCriteriaProps) {
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
}

export default function GroupByYear() {
  return (
    <GroupByPeriod
      viewMethod="notifyGroupByYear"
      exportMethod="exportGroupByYear"
      exportFilename="group-by-year"
      initialCriteria={initialCriteria}
      initialDisplay={initialDisplay}
      additionalCriteriaFactory={AdditionalCriteria as FIXME_any}
      amountSelectorFactory={amountSelectorFactory}
    />
  );
}

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
