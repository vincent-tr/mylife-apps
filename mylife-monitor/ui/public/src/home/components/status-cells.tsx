import styled from '@emotion/styled';
import TableCell from '@mui/material/TableCell';
import { errorColor, successColor, warningColor } from '../../common/status-colors';

export const SuccessCell = styled(TableCell)(({ theme }) => successColor(theme));
export const WarningCell = styled(TableCell)(({ theme }) => warningColor(theme));
export const ErrorCell = styled(TableCell)(({ theme }) => errorColor(theme));
