import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useCallback } from 'react';
import { StatsType } from '../types';

export interface TypeListProps {
  className?: string;
  value: StatsType;
  onChange: (newValue: StatsType) => void;
}

const TYPES = new Map([
  [StatsType.Day, 'Jour'],
  [StatsType.Month, 'Mois'],
  [StatsType.Year, 'Année'],
]);

export default function TypeList({ className, value, onChange }: TypeListProps) {
  const renderSelectorValue = useCallback((selection: unknown) => TYPES.get(selection as StatsType), []);

  return (
    <Select value={value} onChange={(event) => onChange(event.target.value as StatsType)} input={<Input fullWidth />} renderValue={renderSelectorValue} className={className}>
      {Array.from(TYPES.entries()).map(([id, display]) => (
        <MenuItem key={id} value={id}>
          {display}
        </MenuItem>
      ))}
    </Select>
  );
}
