'use strict';

import React from 'react';
import SvgIcon from '../svg-icon';

import spinner from '-!svg-react-loader?name=Spinner!./spinner.svg';

export const Spinner = ({ ... props }) => (
  <SvgIcon as={spinner} {...props} />
);
