'use strict';

import React from 'react';
import BooleanBase from './helpers/boolean-base';

import './boolean-checkbox.scss';

const BooleanCheckbox = React.forwardRef(({ ...props }, ref) => (
  <BooleanBase ref={ref} editorClassName='boolean-checkbox' {...props} />
));

BooleanCheckbox.displayName = 'BooleanCheckbox';

export default BooleanCheckbox;
