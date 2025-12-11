import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import React, { useCallback } from 'react';
import { CriteriaField } from 'mylife-tools';
import { ReportingCriteria, ReportingDisplay } from '../../api';
import { findAmount, roundCurrency } from './group-by-period/tools';
import GroupByPeriod, { AmountSelectorFactoryProps } from './group-by-period';

type FIXME_any = any;

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
  monthAverage: false,
};

interface AdditionalCriteriaProps {
  display: ReportingDisplay;
  onDisplayChanged: (display: ReportingDisplay) => void;
}

function AdditionalCriteria({ display, onDisplayChanged }: AdditionalCriteriaProps) {
  const onMonthAverageChanged = useCallback((value: boolean) => onDisplayChanged({ ...display, monthAverage: value }), [display, onDisplayChanged]);

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
      type="year"
      exportFilename="group-by-year"
      initialCriteria={initialCriteria}
      initialDisplay={initialDisplay}
      additionalCriteriaFactory={AdditionalCriteria}
      amountSelectorFactory={amountSelectorFactory}
    />
  );
}

function amountSelectorFactory({ display }: AmountSelectorFactoryProps) {
  return (periodItem: FIXME_any, serie: FIXME_any) => {
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
