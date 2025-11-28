import TextField from '@mui/material/TextField';
import { TextFieldProps } from '@mui/material/TextField';
import React from 'react';
import { useDebounced } from '../behaviors';

// https://gist.github.com/krambertech/76afec49d7508e89e028fce14894724c
const ENTER_KEY = 13;

export interface DebouncedTextFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: string | null;
  onChange: (value: string) => void;
}

export default function DebouncedTextField({ value, onChange, multiline, ...props }: DebouncedTextFieldProps) {
  const { componentValue, componentChange, flush } = useDebounced(value, onChange);

  const handleChange = (e) => {
    componentChange(e.target.value);
  };

  const handleKeyDown = multiline
    ? null
    : (e) => {
        if (e.keyCode === ENTER_KEY) {
          flush();
        }
      };

  return <TextField {...(props as TextFieldProps)} multiline={multiline} value={componentValue || ''} onChange={handleChange} onKeyDown={handleKeyDown} />;
}
