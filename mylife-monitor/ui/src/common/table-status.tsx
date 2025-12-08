import { alpha, styled, Theme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

const successColor = ({ theme }: { theme: Theme }) => ({
  backgroundColor: alpha(theme.palette.success.main, 0.25),
});

const warningColor = ({ theme }: { theme: Theme }) => ({
  backgroundColor: alpha(theme.palette.warning.main, 0.25),
});

const errorColor = ({ theme }: { theme: Theme }) => ({
  backgroundColor: alpha(theme.palette.error.main, 0.25),
});

export const SuccessRow = styled(TableRow)(successColor);
export const WarningRow = styled(TableRow)(warningColor);
export const ErrorRow = styled(TableRow)(errorColor);

export const SuccessCell = styled(TableCell)(successColor);
export const WarningCell = styled(TableCell)(warningColor);
export const ErrorCell = styled(TableCell)(errorColor);
