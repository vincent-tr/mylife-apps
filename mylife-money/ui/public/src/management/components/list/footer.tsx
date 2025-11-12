import React from 'react';
import clsx from 'clsx';
import { useScreenPhone } from 'mylife-tools-ui';
import { useConnect, useStyles } from './table-behaviors';
import { Toolbar, Typography } from '@mui/material';

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

const Footer = (props) => {
  const classes = useStyles();
  const isPhone = useScreenPhone();
  const { operations } = useConnect();
  const { totalDebit, totalCredit, total } = summaries(operations);
  const totalClasses = [classes.total, isPhone ? classes.totalDense : classes.totalNormal];
  const totalOpsClasses = [classes.total, isPhone ? classes.totalOpsDense : classes.totalOpsNormal];

  return (
    <Toolbar {...props}>
      <Typography>Total</Typography>
      <Typography className={clsx(classes.amountDebit, ...totalClasses)}>{totalDebit}</Typography>
      <Typography className={clsx(classes.amountCredit, ...totalClasses)}>{totalCredit}</Typography>
      <Typography className={clsx(classes.amountTotal, ...totalClasses)}>{total}</Typography>
      <Typography className={clsx(...totalOpsClasses)}>{operations.length} opérations</Typography>
    </Toolbar>
  );
};

export default Footer;
