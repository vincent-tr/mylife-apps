'use strict';

import { colors, createMuiTheme } from '@material-ui/core';

const defaultConfig = {
  palette: {
    primary: colors.blue,
    secondary: colors.pink,
  }
};

let theme = setupTheme(defaultConfig);

export function initTheme(config) {
  theme = setupTheme(config);
}

export function getTheme() {
  return theme;
}

function setupTheme(config) {
  const theme = createMuiTheme(config);

  // additional properties
  if(!theme.status) {
    theme.status = {
      success: colors.green[600],
      info: theme.palette.primary.dark,
      warning: colors.amber[700],
      error: theme.palette.error.dark,
    };
  }

  return theme;
}
