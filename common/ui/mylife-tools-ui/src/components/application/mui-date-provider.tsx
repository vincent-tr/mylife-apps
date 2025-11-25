import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const MuiDateProvider = (props) => <LocalizationProvider dateAdapter={AdapterDateFns} {...props} />;

export default MuiDateProvider;
