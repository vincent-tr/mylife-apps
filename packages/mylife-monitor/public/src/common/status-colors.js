'use strict';

import { mui } from 'mylife-tools-ui';

export const useStatusColorStyles = mui.makeStyles(theme => ({
  success: {
    backgroundColor: mui.fade(theme.palette.success.main, 0.25),
  },
  warning: {
    backgroundColor: mui.fade(theme.palette.warning.main, 0.25),
  },
  error: {
    backgroundColor: mui.fade(theme.palette.error.main, 0.25),
  }
}));
