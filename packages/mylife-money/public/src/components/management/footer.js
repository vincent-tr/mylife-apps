'use strict';

import { React, mui, clsx } from 'mylife-tools-ui';
import { useConnect, useStyles } from './table-behaviors';

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

const Table = (props) => {
  const classes = useStyles();
  const { operations } = useConnect();
  const { totalDebit, totalCredit, total } = summaries(operations);
  return (
    <mui.Toolbar {...props}>
      <p>Total</p>
      <p className={clsx(classes.amountDebit, classes.total)}>{totalDebit}</p>
      <p className={clsx(classes.amountCredit, classes.total)}>{totalCredit}</p>
      <p className={classes.total}>{total}</p>
    </mui.Toolbar>
  );
};

export default Table;
