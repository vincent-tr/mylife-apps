import React, { FunctionComponent } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { useTheme } from '../../services/theme-factory';

const ThemeProvider: FunctionComponent = ({ children }) => {
  const theme = useTheme();

  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
