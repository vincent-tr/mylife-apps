import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React, { PropsWithChildren } from 'react';
import { useTheme } from '../../services/theme-factory';

export default function ThemeProvider({ children }: PropsWithChildren) {
  const theme = useTheme();

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
