import React from 'react';
import MuiDateProvider from './mui-date-provider';
import StoreProvider from './store-provider';
import ThemeProvider from './theme-provider';

export interface ToolsProviderProps {
  children?: React.ReactNode;
}

const ToolsProvider: React.FC<ToolsProviderProps> = ({ children }) => (
  <MuiDateProvider>
    <ThemeProvider>
      <StoreProvider>{children}</StoreProvider>
    </ThemeProvider>
  </MuiDateProvider>
);

export default ToolsProvider;
