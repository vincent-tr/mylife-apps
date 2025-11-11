import React, { FunctionComponent, PropsWithChildren } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { useTheme } from '../../services/theme-factory';

const ThemeProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();

  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
