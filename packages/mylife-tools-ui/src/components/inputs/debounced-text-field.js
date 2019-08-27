'use strict';

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';

// https://gist.github.com/krambertech/76afec49d7508e89e028fce14894724c
const ENTER_KEY = 13;
const WAIT_INTERVAL = 300;

class Debounce {
  constructor(callback) {
    this.timer = null;
    this.callback = callback;
  }

  call(args) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this._doCall(args), WAIT_INTERVAL);
  }

  forceCall(args) {
    this._doCall(args);
  }

  _doCall(args) {
    this.reset();
    this.callback(args);
  }

  reset() {
    clearTimeout(this.timer);
    this.timer = null;
  }
}

const DebouncedTextField = ({ value, onChange, ...props }) => {
  const debounceRef = useRef(new Debounce(value => onChange(value)));
  useEffect(() => () => debounceRef.current.reset(), []);

  const [stateValue, setStateValue] = useState(value);
  useEffect(() => {
    setStateValue(value);
    debounceRef.current.reset();
  }, [value]);

  const handleChange = e => {
    const newValue = e.target.value;
    setStateValue(newValue);
    debounceRef.current.call(newValue);
  };

  const handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      debounceRef.current.forceCall(stateValue);
    }
  };

  return (
    <TextField {...props} value={stateValue || ''} onChange={handleChange} onKeyDown={handleKeyDown} />
  );
};

DebouncedTextField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default DebouncedTextField;
