'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';

const IntegerField = ({ value, onChange, minValue, maxValue, ...props}) => {

  const onIntegerChange = (event) => {
    event.stopPropagation();
    const value = parseInt(event.target.value, 10);
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
      onChange={onIntegerChange}
      type='number' />
  );
};

IntegerField.propTypes = {
  value      : PropTypes.number,
  onChange   : PropTypes.func.isRequired,
  minValue   : PropTypes.number,
  maxValue   : PropTypes.number,
};

export default IntegerField;
