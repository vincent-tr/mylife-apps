import PropTypes from 'prop-types';
import React from 'react';
import MuiDateProvider from './mui-date-provider';
import StoreProvider from './store-provider';
import ThemeProvider from './theme-provider';

const ToolsProvider = ({ children }) => (
  <MuiDateProvider>
    <ThemeProvider>
      <StoreProvider>{children}</StoreProvider>
    </ThemeProvider>
  </MuiDateProvider>
);

ToolsProvider.propTypes = {
  children: PropTypes.node,
};

export default ToolsProvider;
