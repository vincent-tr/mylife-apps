'use strict';

import { React, mui, PropTypes, clsx } from 'mylife-tools-ui';

const { makeStyles } = mui;

const useStyles = makeStyles(theme => ({
  base: {
    width: 100,
    paddingLeft: theme.spacing(1)
  },
  debit: {
    backgroundColor: mui.colors.red[100]
  },
  credit: {
    backgroundColor: mui.colors.lightGreen[100]
  },
}));

const AmountValue = ({ className, value }) => {
  const classes = useStyles();

  return (
    <mui.Typography className={clsx(className, classes.base, value < 0 ? classes.debit : classes.credit)}>
      {value}
    </mui.Typography>
  );
};

AmountValue.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
};

export default AmountValue;
