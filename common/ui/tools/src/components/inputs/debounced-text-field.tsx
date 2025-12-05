import TextField from '@mui/material/TextField';
import { TextFieldProps } from '@mui/material/TextField';
import { useDebounced } from '../behaviors';
import { useCallback, useMemo } from 'react';

// https://gist.github.com/krambertech/76afec49d7508e89e028fce14894724c
const ENTER_KEY = 13;

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
            if (e.keyCode === ENTER_KEY) {
              flush();
            }
          },
    [flush, multiline]
  );

  return <TextField {...(props as TextFieldProps)} multiline={multiline} value={componentValue || ''} onChange={handleChange} onKeyDown={handleKeyDown} />;
}
