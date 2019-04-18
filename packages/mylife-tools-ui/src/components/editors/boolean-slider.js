'use strict';

import React from 'react';
import BooleanBase from './helpers/boolean-base';

import './boolean-slider.scss';

const BooleanSlider = React.forwardRef(({ ...props }, ref) => (
  <BooleanBase ref={ref} editorClassName='boolean-slider' {...props} />
));

BooleanSlider.displayName = 'BooleanSlider';

export default BooleanSlider;
