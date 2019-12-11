'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';

const NumberField = ({ value, onChange, minValue, maxValue, ...props}) => {

  const onNumberChange = (event) => {
    event.stopPropagation();
    const value = parseFloat(event.target.value);
    if(isNaN(value)) {
      return;
    }
    if(typeof minValue === 'number' && value < minValue) {
      return;
    }
    if(typeof maxValue === 'number' && value > maxValue) {
      return;
    }
    onChange(value);
  };

  return (
    <mui.TextField
      {...props}
      value={value}
      onChange={onNumberChange}
      type='number' />
  );
};

NumberField.propTypes = {
  value      : PropTypes.number,
  onChange   : PropTypes.func.isRequired,
  minValue   : PropTypes.number,
  maxValue   : PropTypes.number,
};

export default NumberField;
