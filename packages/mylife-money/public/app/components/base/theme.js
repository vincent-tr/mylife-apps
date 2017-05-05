'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as muiStyles from 'material-ui/styles/index';

const theme = muiStyles.getMuiTheme(muiStyles.lightBaseTheme);

const Theme = (props) => (
  <muiStyles.MuiThemeProvider muiTheme={theme}>
    { props.children }
  </muiStyles.MuiThemeProvider>
);

Theme.propTypes = {
  children: PropTypes.node
};

export default Theme;
