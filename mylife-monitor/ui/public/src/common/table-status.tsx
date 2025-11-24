import { alpha, styled } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const successColor = ({ theme }) => ({
  backgroundColor: alpha(theme.palette.success.main, 0.25),
});

const warningColor = ({ theme }) => ({
  backgroundColor: alpha(theme.palette.warning.main, 0.25),
});

const errorColor = ({ theme }) => ({
  backgroundColor: alpha(theme.palette.error.main, 0.25),
});

export const SuccessRow = styled(TableRow)(successColor);
export const WarningRow = styled(TableRow)(warningColor);
export const ErrorRow = styled(TableRow)(errorColor);

export const SuccessCell = styled(TableCell)(successColor);
export const WarningCell = styled(TableCell)(warningColor);
export const ErrorCell = styled(TableCell)(errorColor);
