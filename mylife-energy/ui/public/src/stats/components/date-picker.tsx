import React from 'react';
import { mui, clsx } from 'mylife-tools-ui';
import { StatsType } from '../actions';
import icons from '../../common/icons';

export interface DatePickerProps {
  className?: string;
  type: StatsType;
  value: Date;
  onChange: (newValue: Date) => void;
}

const useStyles = mui.makeStyles(theme => ({
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
      <mui.IconButton onClick={() => onChange(addDay(value, -1))}>
        <icons.actions.Prev />
      </mui.IconButton>

      <mui.DatePicker className={classes.picker} views={["year", "month", "date"]} value={value} onChange={onChange} />
      
      <mui.IconButton onClick={() => onChange(addDay(value, 1))}>
        <icons.actions.Next />
      </mui.IconButton>
    </div>
  );
};

const MonthPicker: React.FunctionComponent<Omit<DatePickerProps, 'type'>> = ({ className, value, onChange }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.container, className)}>
      <mui.IconButton onClick={() => onChange(addMonth(value, -1))}>
        <icons.actions.Prev />
      </mui.IconButton>

      <mui.DatePicker className={classes.picker} views={["year", "month"]} value={value} onChange={onChange} />

      <mui.IconButton onClick={() => onChange(addMonth(value, 1))}>
        <icons.actions.Next />
      </mui.IconButton>
    </div>
  );
};

const YearPicker: React.FunctionComponent<Omit<DatePickerProps, 'type'>> = ({ className, value, onChange }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.container, className)}>
      <mui.IconButton onClick={() => onChange(addYear(value, -1))}>
        <icons.actions.Prev />
      </mui.IconButton>

      <mui.DatePicker className={classes.picker} views={["year"]} value={value} onChange={onChange} />

      <mui.IconButton onClick={() => onChange(addYear(value, 1))}>
        <icons.actions.Next />
      </mui.IconButton>
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
