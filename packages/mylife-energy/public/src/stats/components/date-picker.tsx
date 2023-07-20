import { React, mui } from 'mylife-tools-ui';
import { StatsType } from '../actions';
import icons from '../../common/icons';

export interface DatePickerProps {
  type: StatsType;
  value: Date;
  onChange: (newValue: Date) => void;
}

const DatePicker: React.Component<DatePickerProps> = ({ type, value, onChange }) => {
  switch (type) {

  case StatsType.Day:
    return (<DayPicker value={value} onChange={onChange} />);

  case StatsType.Month:
    return (<MonthPicker value={value} onChange={onChange} />);

  case StatsType.Year:
    return (<YearPicker value={value} onChange={onChange} />);

  default:
    throw new Error(`Unknown type: ${type}`);
  }
};

export default DatePicker;

const DayPicker: React.Component<Omit<DatePickerProps, 'type'>> = ({ value, onChange }) => {
  return (
    <div>
      <mui.IconButton onClick={() => onChange(addDay(value, -1))}>
        <icons.actions.Prev />
      </mui.IconButton>

      <mui.DatePicker views={["year", "month", "date"]} value={value} onChange={onChange} />
      
      <mui.IconButton onClick={() => onChange(addDay(value, 1))}>
        <icons.actions.Next />
      </mui.IconButton>
    </div>
  );
};

const MonthPicker: React.Component<Omit<DatePickerProps, 'type'>> = ({ value, onChange }) => {
  return (
    <div>
      <mui.IconButton onClick={() => onChange(addMonth(value, -1))}>
        <icons.actions.Prev />
      </mui.IconButton>

      <mui.DatePicker views={["year", "month"]} value={value} onChange={onChange} />

      <mui.IconButton onClick={() => onChange(addMonth(value, 1))}>
        <icons.actions.Next />
      </mui.IconButton>
    </div>
  );
};

const YearPicker: React.Component<Omit<DatePickerProps, 'type'>> = ({ value, onChange }) => {
  return (
    <div>
      <mui.IconButton onClick={() => onChange(addYear(value, -1))}>
        <icons.actions.Prev />
      </mui.IconButton>

      <mui.DatePicker views={["year"]} value={value} onChange={onChange} />

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
