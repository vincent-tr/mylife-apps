import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { colors, Typography, makeStyles } from '@mui/material';

const useStyles = makeStyles(theme => ({
  base: {
    width: 100,
    paddingLeft: theme.spacing(1)
  },
  debit: {
    backgroundColor: colors.red[100]
  },
  credit: {
    backgroundColor: colors.lightGreen[100]
  },
}));

const AmountValue : FunctionComponent<AmountValueProps> = ({ className, value }) => {
  const classes = useStyles();

  return (
    <Typography className={clsx(className, classes.base, value < 0 ? classes.debit : classes.credit)}>
      {value}
    </Typography>
  );
};

type AmountValueProps = {
  className?: string,
  value: number
};

export default AmountValue;
