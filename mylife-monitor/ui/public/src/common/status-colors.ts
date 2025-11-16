import { alpha } from '@mui/material';

export const successColor = (theme) => ({
  backgroundColor: alpha(theme.palette.success.main, 0.25),
});

export const warningColor = (theme) => ({
  backgroundColor: alpha(theme.palette.warning.main, 0.25),
});

export const errorColor = (theme) => ({
  backgroundColor: alpha(theme.palette.error.main, 0.25),
});
