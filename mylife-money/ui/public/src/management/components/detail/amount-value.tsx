'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { colors, Typography, makeStyles } from '@material-ui/core';

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

const AmountValue = ({ className, value }) => {
  const classes = useStyles();

  return (
    <Typography className={clsx(className, classes.base, value < 0 ? classes.debit : classes.credit)}>
      {value}
    </Typography>
  );
};

AmountValue.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
};

export default AmountValue;
