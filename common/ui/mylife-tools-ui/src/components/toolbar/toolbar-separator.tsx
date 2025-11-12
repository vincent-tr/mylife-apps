import React from 'react';
import { makeStyles, Typography } from '@mui/material';

const useStyles = makeStyles(theme => ({
  separator: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    color: theme.palette.divider,
    borderRight: '0.1em solid currentColor'
  }
}));

const ToolbarSeparator = () => {
  const classes = useStyles();
  return (
    <Typography className={classes.separator}>&nbsp;</Typography>
  );
};

export default ToolbarSeparator;
