import React from 'react';
import clsx from 'clsx';
import { StatsType } from '../types';
import icons from '../../common/icons';
import { makeStyles, IconButton } from '@mui/material';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers';

export interface DatePickerProps {
  className?: string;
  type: StatsType;
  value: Date;
  onChange: (newValue: Date) => void;
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  picker: {
    flex: '1 1 auto',
  }
}));

const DatePicker: React.FunctionComponent<DatePickerProps> = ({ className, type, value, onChange }) => {
  switch (type) {

  case StatsType.Day:
    return (<DayPicker className={className} value={value} onChange={onChange} />);

  case StatsType.Month:
    return (<MonthPicker className={className} value={value} onChange={onChange} />);

  case StatsType.Year:
    return (<YearPicker className={className} value={value} onChange={onChange} />);

  default:
    throw new Error(`Unknown type: ${type}`);
  }
};

export default DatePicker;

const DayPicker: React.FunctionComponent<Omit<DatePickerProps, 'type'>> = ({ className, value, onChange }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.container, className)}>
      <IconButton onClick={() => onChange(addDay(value, -1))}>
        <icons.actions.Prev />
      </IconButton>

      <MuiDatePicker className={classes.picker} views={["year", "month", "date"]} value={value} onChange={onChange} />
      
      <IconButton onClick={() => onChange(addDay(value, 1))}>
        <icons.actions.Next />
      </IconButton>
    </div>
  );
};

const MonthPicker: React.FunctionComponent<Omit<DatePickerProps, 'type'>> = ({ className, value, onChange }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.container, className)}>
      <IconButton onClick={() => onChange(addMonth(value, -1))}>
        <icons.actions.Prev />
      </IconButton>

      <MuiDatePicker className={classes.picker} views={["year", "month"]} value={value} onChange={onChange} />

      <IconButton onClick={() => onChange(addMonth(value, 1))}>
        <icons.actions.Next />
      </IconButton>
    </div>
  );
};

const YearPicker: React.FunctionComponent<Omit<DatePickerProps, 'type'>> = ({ className, value, onChange }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.container, className)}>
      <IconButton onClick={() => onChange(addYear(value, -1))}>
        <icons.actions.Prev />
      </IconButton>

      <MuiDatePicker className={classes.picker} views={["year"]} value={value} onChange={onChange} />

      <IconButton onClick={() => onChange(addYear(value, 1))}>
        <icons.actions.Next />
      </IconButton>
    </div>
  );
};

function addDay(date: Date, count: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + count);
  return newDate;
}

function addMonth(date: Date, count: number) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + count);
  return newDate;
}

function addYear(date: Date, count: number) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + count);
  return newDate;
}
