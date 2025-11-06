'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { mui, clsx } from 'mylife-tools-ui';

import Tree from './tree';
import Toolbar from './toolbar';

const { makeStyles } = mui;

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
    <mui.Paper className={clsx(classes.container, className)}>
      <Tree className={classes.tree}/>
      <mui.Divider />
      <Toolbar />
    </mui.Paper>
  );
};

TreeContainer.propTypes = {
  className: PropTypes.string
};

export default TreeContainer;
