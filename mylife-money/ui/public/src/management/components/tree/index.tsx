'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import Tree from './tree';
import Toolbar from './toolbar';
import { makeStyles, Paper, Divider } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 500,
  },
  tree: {
    overflowY: 'auto',
    flex: '1 1 auto',
  },
});

const TreeContainer = ({ className }) => {
  const classes = useStyles();

  return (
    <Paper className={clsx(classes.container, className)}>
      <Tree className={classes.tree}/>
      <Divider />
      <Toolbar />
    </Paper>
  );
};

TreeContainer.propTypes = {
  className: PropTypes.string
};

export default TreeContainer;
