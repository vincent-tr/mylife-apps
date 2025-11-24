import React, { FunctionComponent, PropsWithChildren } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
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
