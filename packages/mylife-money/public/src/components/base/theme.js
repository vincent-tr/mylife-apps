'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { colors, createMuiTheme, MuiThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: colors.blue,
    secondary: colors.pink,
  }
});

const Theme = (props) => (
  <MuiThemeProvider theme={theme}>
    { props.children }
  </MuiThemeProvider>
);

Theme.propTypes = {
  children: PropTypes.node
};

export default Theme;
