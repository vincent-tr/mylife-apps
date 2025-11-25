import TextField from '@mui/material/TextField';
import { TextFieldProps } from '@mui/material/TextField';
import PropTypes from 'prop-types';
import React, { FunctionComponent } from 'react';
import { useDebounced } from '../behaviors';

// https://gist.github.com/krambertech/76afec49d7508e89e028fce14894724c
const ENTER_KEY = 13;

export type DebouncedTextFieldProps = Omit<TextFieldProps, 'value' | 'onChange'> & { value: any; onChange: (value: any) => void };

const DebouncedTextField: FunctionComponent<DebouncedTextFieldProps> = ({ value, onChange, multiline, ...props }) => {
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
};

DebouncedTextField.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

export default DebouncedTextField;
