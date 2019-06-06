'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import MuiUtilsProvider from './mui-utils-provider';
import StoreProvider from './store-provider';
import ThemeProvider from './theme-provider';

const ToolsProvider = ({ children }) => (
  <MuiUtilsProvider>
    <ThemeProvider>
      <StoreProvider>
        {children}
      </StoreProvider>
    </ThemeProvider>
  </MuiUtilsProvider>
);

ToolsProvider.propTypes = {
  children : PropTypes.node
};

export default ToolsProvider;
