import React from 'react';
import { StatsType } from '../types';
import DeviceList from './device-list';
import TypeList from './type-list';
import DatePicker from './date-picker';
import { styled } from '@mui/material/styles';

export interface Criteria {
  type: StatsType;
  date: Date;
  devices: string[];
}

const Container = styled('div')<{ className?: string }>({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
});

const DeviceListSelector = styled(DeviceList)(({ theme }) => ({
  width: 300,
  marginLeft: theme.spacing(4),
}));

const TypeListSelector = styled(TypeList)(({ theme }) => ({
  width: 300,
  marginLeft: theme.spacing(4),
}));

const DatePickerSelector = styled(DatePicker)(({ theme }) => ({
  width: 300,
  marginLeft: theme.spacing(4),
}));

const CriteriaSelector: React.FC<{ className?: string; criteria: Criteria; onChange: (newCriteriaProps: Partial<Criteria>) => void }> = ({ className, criteria, onChange }) => {
  return (
    <Container className={className}>
      <DeviceListSelector value={criteria.devices} onChange={(devices) => onChange({ devices })} />
      <TypeListSelector value={criteria.type} onChange={(type) => onChange({ type })} />
      <DatePickerSelector type={criteria.type} value={criteria.date} onChange={(date) => onChange({ date })} />
    </Container>
  );
};

export default CriteriaSelector;
