'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { useDebounced } from '../behaviors';

// https://gist.github.com/krambertech/76afec49d7508e89e028fce14894724c
const ENTER_KEY = 13;

const DebouncedTextField = ({ value, onChange, ...props }) => {
  const { componentValue, componentChange, flush } = useDebounced(value, onChange);

  const handleChange = e => {
    componentChange(e.target.value);
  };

  const handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      flush();
    }
  };

  return (
    <TextField {...props} value={componentValue || ''} onChange={handleChange} onKeyDown={handleKeyDown} />
  );
};

DebouncedTextField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default DebouncedTextField;
