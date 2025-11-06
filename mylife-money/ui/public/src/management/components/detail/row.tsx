'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'baseline',
  },
  label: {
    width: 100
  },
  content: {
    flex: '1 1 auto'
  },
}));

const Row = ({ label, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography className={classes.label}>
        {label}
      </Typography>

      <div className={classes.content}>
        {children}
      </div>
    </div>
  );
};

Row.propTypes = {
  label: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
};

export default Row;
