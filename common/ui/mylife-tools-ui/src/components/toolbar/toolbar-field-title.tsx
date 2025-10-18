'use strict';

import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  title: {
    marginRight: theme.spacing(2),
  }
}));

const ToolbarFieldTitle = ({ ...props }) => {
  const classes = useStyles();
  return (
    <Typography className={classes.title} {...props} />
  );
};

export default ToolbarFieldTitle;
