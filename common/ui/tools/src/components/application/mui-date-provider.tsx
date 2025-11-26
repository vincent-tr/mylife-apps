import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';

const MuiDateProvider = (props) => <LocalizationProvider dateAdapter={AdapterDateFns} {...props} />;

export default MuiDateProvider;
