import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import React from 'react';
import icons from '../../common/icons';
import { StatsType } from '../types';

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

export default function DatePicker({ type, value, onChange }: DatePickerProps) {
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
}

const StyledPicker = styled(MuiDatePicker)({
  flex: '1 1 auto',
});

function DayPicker({ value, onChange }: Omit<DatePickerProps, 'type'>) {
  return (
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
}

function MonthPicker({ value, onChange }: Omit<DatePickerProps, 'type'>) {
  return (
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
}

function YearPicker({ value, onChange }: Omit<DatePickerProps, 'type'>) {
  return (
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
}

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
