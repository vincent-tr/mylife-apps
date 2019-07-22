'use strict';

import React from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const MuiUtilsProvider = (props) => (
  <MuiPickersUtilsProvider utils={DateFnsUtils} {...props} />
);

export default MuiUtilsProvider;
