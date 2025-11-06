import { makeStyles, alpha } from '@material-ui/core';
'use strict';


export const useStatusColorStyles = makeStyles(theme => ({
  success: {
    backgroundColor: alpha(theme.palette.success.main, 0.25),
  },
  warning: {
    backgroundColor: alpha(theme.palette.warning.main, 0.25),
  },
  error: {
    backgroundColor: alpha(theme.palette.error.main, 0.25),
  }
}));
