'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { colors, createMuiTheme, MuiThemeProvider } from '@material-ui/core';

const defaultThemeConfig = {
  palette: {
    primary: colors.blue,
    secondary: colors.pink,
  }
};

const ThemeProvider = ({ theme = createMuiTheme(defaultThemeConfig), ...props }) => (
  <MuiThemeProvider theme={theme} {...props} />
);

ThemeProvider.propTypes = {
  theme: PropTypes.object
};

export default ThemeProvider;
