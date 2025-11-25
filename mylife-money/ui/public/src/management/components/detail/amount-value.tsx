import React, { FunctionComponent } from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import * as colors from '@mui/material/colors';

type AmountType = 'debit' | 'credit';

const COLORS = {
  debit: colors.red[100],
  credit: colors.lightGreen[100],
};

const AmountTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'amountType',
})<{ amountType: AmountType }>(({ amountType, theme }) => ({
  width: 100,
  paddingLeft: theme.spacing(1),
  backgroundColor: COLORS[amountType],
}));

const AmountValue: FunctionComponent<AmountValueProps> = ({ className, value }) => {
  return (
    <AmountTypography amountType={value < 0 ? 'debit' : 'credit'} className={className}>
      {value}
    </AmountTypography>
  );
};

type AmountValueProps = {
  className?: string;
  value: number;
};

export default AmountValue;
