'use strict';

import { mui } from 'mylife-tools-ui';

export const useStatusColorStyles = mui.makeStyles(theme => ({
  success: {
    backgroundColor: mui.alpha(theme.palette.success.main, 0.25),
  },
  warning: {
    backgroundColor: mui.alpha(theme.palette.warning.main, 0.25),
  },
  error: {
    backgroundColor: mui.alpha(theme.palette.error.main, 0.25),
  }
}));
