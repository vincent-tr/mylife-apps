import React from 'react';
import clsx from 'clsx';
import immutable from 'immutable';
import { StatsType } from '../types';
import DeviceList from './device-list';
import TypeList from './type-list';
import DatePicker from './date-picker';
import { makeStyles } from '@mui/material';

export interface Criteria {
  type: StatsType;
  date: Date;
  devices: immutable.Set<string>;
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selector: {
    width: 300,
    marginLeft: theme.spacing(4),
  }
}));

const CriteriaSelector: React.FunctionComponent<{className?: string; criteria: Criteria; onChange: (newCriteriaProps: Partial<Criteria>) => void }> = ({ className, criteria, onChange }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.container, className)}>
      <DeviceList className={classes.selector} value={criteria.devices} onChange={devices => onChange({ devices })} />
      <TypeList className={classes.selector} value={criteria.type} onChange={type => onChange({ type })} />
      <DatePicker className={classes.selector} type={criteria.type} value={criteria.date} onChange={date => onChange({ date })} />
    </div>
  );
}

export default CriteriaSelector;
