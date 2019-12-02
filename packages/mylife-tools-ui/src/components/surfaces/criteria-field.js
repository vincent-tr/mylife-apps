'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%'
  },
  label: {
    marginRight: theme.spacing(1)
  },
  children: {
  }
}));

const CriteriaField = ({ label, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography className={classes.label}>{label}</Typography>
      <div className={classes.children}>
        {children}
      </div>
    </div>
  );
};

CriteriaField.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default CriteriaField;
