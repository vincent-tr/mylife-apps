import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import Tree from './tree';
import Toolbar from './toolbar';
import { makeStyles, Paper, Divider } from '@mui/material';

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

interface TreeContainerProps {
  className?: string;
}

const TreeContainer: React.FC<TreeContainerProps> = ({ className }) => {
  const classes = useStyles();

  return (
    <Paper className={clsx(classes.container, className)}>
      <Tree className={classes.tree}/>
      <Divider />
      <Toolbar />
    </Paper>
  );
};


export default TreeContainer;
