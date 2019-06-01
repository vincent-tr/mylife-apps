'use strict';

import React from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

const MuiUtilsProvider = (props) => (
  <MuiPickersUtilsProvider utils={MomentUtils} {...props} />
);

export default MuiUtilsProvider;
