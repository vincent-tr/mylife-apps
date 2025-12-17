import TextField from '@mui/material/TextField';
import { TextFieldProps } from '@mui/material/TextField';
import { useCallback, useMemo } from 'react';
import { useDebounced } from '../behaviors';

const ENTER_KEY = 'Enter';

export interface DebouncedTextFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: string | null;
  onChange: (value: string) => void;
}

export default function DebouncedTextField({ value, onChange, multiline, ...props }: DebouncedTextFieldProps) {
  const { componentValue, componentChange, flush } = useDebounced(value, onChange);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      componentChange(e.target.value);
    },
    [componentChange]
  );

  const handleKeyDown = useMemo(
    () =>
      multiline
        ? null
        : (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === ENTER_KEY) {
              flush();
            }
          },
    [flush, multiline]
  );

  return <TextField {...(props as TextFieldProps)} multiline={multiline} value={componentValue || ''} onChange={handleChange} onKeyDown={handleKeyDown} />;
}
