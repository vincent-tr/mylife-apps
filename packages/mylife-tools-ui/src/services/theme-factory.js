'use strict';

import { colors, createMuiTheme } from '@material-ui/core';

const defaultConfig = {
  palette: {
    primary: colors.blue,
    secondary: colors.pink,
  }
};

let theme = createMuiTheme(defaultConfig);

export function initTheme(config) {
  theme = createMuiTheme(config);
}

export function getTheme() {
  return theme;
}
