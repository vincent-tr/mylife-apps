import { colors, createTheme } from '@material-ui/core';

const defaultConfig = {
  palette: {
    primary: colors.blue,
    secondary: colors.pink,
  }
};

let theme = createTheme(defaultConfig);

export function initTheme(config) {
  theme = createTheme(config);
}

export function getTheme() {
  return theme;
}
