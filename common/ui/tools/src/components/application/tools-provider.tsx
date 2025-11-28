import { PropsWithChildren } from 'react';
import MuiDateProvider from './mui-date-provider';
import StoreProvider from './store-provider';
import ThemeProvider from './theme-provider';

export default function ToolsProvider({ children }: PropsWithChildren) {
  return (
    <MuiDateProvider>
      <ThemeProvider>
        <StoreProvider>{children}</StoreProvider>
      </ThemeProvider>
    </MuiDateProvider>
  );
}
