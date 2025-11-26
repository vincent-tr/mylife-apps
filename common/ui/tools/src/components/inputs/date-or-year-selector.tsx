import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { FunctionComponent } from 'react';
import YearSelectorButton from './year-selector-button';

const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const StyledDatePicker = styled(DatePicker)({
  width: 170,
});

interface DateOrYearSelectorProps {
  disabled?: boolean;
  value: Date;
  onChange: (value: Date) => void;
  showYearSelector?: boolean;
  selectLastDay?: boolean;
}

const DateOrYearSelector: FunctionComponent<DateOrYearSelectorProps> = ({ disabled = false, onChange, value, showYearSelector = false, selectLastDay = false }) => {
  return (
    <Container>
      <StyledDatePicker
        disabled={disabled}
        value={value}
        onChange={onChange}
        format="dd/MM/yyyy"
        slotProps={{
          textField: {
            variant: 'outlined',
            size: 'small',
          },
          actionBar: {
            actions: ['clear', 'cancel', 'accept'],
          },
        }}
      />
      {showYearSelector && <YearSelectorButton disabled={disabled} value={value} onChange={onChange} selectLastDay={selectLastDay} />}
    </Container>
  );
};

export default DateOrYearSelector;
