import { styled } from '@mui/material/styles';
import { StatsType } from '../types';
import DatePicker from './date-picker';
import DeviceList from './device-list';
import TypeList from './type-list';

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

export interface CriteriaSelectorProps {
  className?: string;
  criteria: Criteria;
  onChange: (newCriteriaProps: Partial<Criteria>) => void;
}

export default function CriteriaSelector({ className, criteria, onChange }: CriteriaSelectorProps) {
  return (
    <Container className={className}>
      <DeviceListSelector value={criteria.devices} onChange={(devices) => onChange({ devices })} />
      <TypeListSelector value={criteria.type} onChange={(type) => onChange({ type })} />
      <DatePickerSelector type={criteria.type} value={criteria.date} onChange={(date) => onChange({ date })} />
    </Container>
  );
}
