import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';
import { useCallback } from 'react';

const NULL_ID = 'null-id';

export interface ListSelectorProps extends Omit<SelectProps, 'value' | 'onChange' | 'children' | 'variant'> {
  list: { id?: string; text: string }[];
  value?: string | null;
  onChange: (value: string | null) => void;
}

export default function ListSelector({ list, value, onChange, ...props }: ListSelectorProps) {
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => onChange(nullFromEditor(event.target.value)), [onChange]);
  return (
    <Select value={value || NULL_ID} onChange={handleChange} {...props}>
      {list.map((field) => (
        <MenuItem key={field.id || NULL_ID} value={field.id || NULL_ID}>
          {field.text}
        </MenuItem>
      ))}
    </Select>
  );
}

function nullFromEditor(value: string) {
  if (value === NULL_ID) {
    return null;
  }

  return value;
}
