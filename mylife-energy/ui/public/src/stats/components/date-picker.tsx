import React from 'react';
import { StatsType } from '../types';
import icons from '../../common/icons';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';

export interface DatePickerProps {
  type: StatsType;
  value: Date;
  onChange: (newValue: Date) => void;
}

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
});

const DatePicker: React.FC<DatePickerProps> = ({ type, value, onChange }) => {
  switch (type) {
    case StatsType.Day:
      return <DayPicker value={value} onChange={onChange} />;

    case StatsType.Month:
      return <MonthPicker value={value} onChange={onChange} />;

    case StatsType.Year:
      return <YearPicker value={value} onChange={onChange} />;

    default:
      throw new Error(`Unknown type: ${type}`);
  }
};

export default DatePicker;

const StyledPicker = styled(MuiDatePicker)({
  flex: '1 1 auto',
});

const DayPicker: React.FC<Omit<DatePickerProps, 'type'>> = ({ value, onChange }) => (
  <Container>
    <IconButton onClick={() => onChange(addDay(value, -1))}>
      <icons.actions.Prev />
    </IconButton>

    <StyledPicker views={['year', 'month', 'day']} value={value} onChange={onChange} />

    <IconButton onClick={() => onChange(addDay(value, 1))}>
      <icons.actions.Next />
    </IconButton>
  </Container>
);

const MonthPicker: React.FC<Omit<DatePickerProps, 'type'>> = ({ value, onChange }) => (
  <Container>
    <IconButton onClick={() => onChange(addMonth(value, -1))}>
      <icons.actions.Prev />
    </IconButton>

    <StyledPicker views={['year', 'month']} value={value} onChange={onChange} />

    <IconButton onClick={() => onChange(addMonth(value, 1))}>
      <icons.actions.Next />
    </IconButton>
  </Container>
);

const YearPicker: React.FC<Omit<DatePickerProps, 'type'>> = ({ value, onChange }) => (
  <Container>
    <IconButton onClick={() => onChange(addYear(value, -1))}>
      <icons.actions.Prev />
    </IconButton>

    <StyledPicker views={['year']} value={value} onChange={onChange} />

    <IconButton onClick={() => onChange(addYear(value, 1))}>
      <icons.actions.Next />
    </IconButton>
  </Container>
);

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
