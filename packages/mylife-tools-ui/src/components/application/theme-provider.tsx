'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core';
import { getTheme } from '../../services/theme-factory';

const ThemeProvider = ({ children }) => (
  <MuiThemeProvider theme={getTheme()}>
    {children}
  </MuiThemeProvider>
);

ThemeProvider.propTypes = {
  children : PropTypes.node
};

export default ThemeProvider;
