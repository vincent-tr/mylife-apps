'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from '@material-ui/core';
import { useDebounced } from '../behaviors';

const DebouncedSlider = ({ value, onChange, ...props }) => {
  const { componentValue, componentChange } = useDebounced(value, onChange);

  const handleChange = (e, value) => {
    componentChange(value);
  };

  return (
    <Slider {...props} value={componentValue} onChange={handleChange} />
  );
};

DebouncedSlider.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired
};

export default DebouncedSlider;
