import React from 'react';
import { Toolbar, Typography, styled } from '@mui/material';
import { useScreenPhone } from 'mylife-tools-ui';
import { AMOUNT_CREDIT, AMOUNT_DEBIT, AMOUNT_TOTAL, useConnect } from './table-behaviors';

function summaries(operations) {
  let totalDebit = 0;
  let totalCredit = 0;
  let total = 0;
  for(const op of operations) {
    const amount = op.operation.amount;
    amount < 0 ? (totalDebit += -amount) : (totalCredit += amount);
    total += amount;
  }
  totalDebit = Math.round(totalDebit * 100) / 100;
  totalCredit = Math.round(totalCredit * 100) / 100;
  total = Math.round(total * 100) / 100;

  return { totalDebit, totalCredit, total };
}

interface TotalProps {
  dense: boolean;
  type: 'debit' | 'credit' | 'total';
}

const colors = {
  debit: AMOUNT_DEBIT,
  credit: AMOUNT_CREDIT,
  total: AMOUNT_TOTAL,
};

const Total = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'dense' && prop !== 'type',
})<TotalProps>(({ theme, dense, type }) => {
  const base = {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: colors[type],
  };

  return dense ? {
    ...base,
    width: 80,
    marginLeft: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  } : {
    ...base,
    width: 100,
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  };
});

interface TotalOpsProps {
  dense: boolean;
}

const TotalOps = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'dense',
})<TotalOpsProps>(({ theme, dense }) => {
  const base = {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  };

  return dense ? {
    ...base,
    width: 80,
    marginLeft: theme.spacing(1),
  } : {
    ...base,
    marginLeft: theme.spacing(2),
  };
});

const Footer = (props) => {
  const isPhone = useScreenPhone();
  const { operations } = useConnect();
  const { totalDebit, totalCredit, total } = summaries(operations);

  return (
    <Toolbar {...props}>
      <Typography>Total</Typography>
      <Total dense={isPhone} type="debit">{totalDebit}</Total>
      <Total dense={isPhone} type="credit">{totalCredit}</Total>
      <Total dense={isPhone} type="total">{total}</Total>
      <TotalOps dense={isPhone}>{operations.length} opérations</TotalOps>
    </Toolbar>
  );
};

export default Footer;
