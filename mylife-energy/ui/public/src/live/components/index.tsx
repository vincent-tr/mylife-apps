import React from 'react';
import { useLifecycle, useActions } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import MainAnimation from './main-animation';
import NodeTable from './node-table';
import { makeStyles } from '@mui/material';

const useStyles = makeStyles(theme => ({
  container: {
    flex: '1 1 auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Live: React.FunctionComponent = () => {
  useViewLifecycle();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <MainAnimation />
      <NodeTable />
    </div>
  );
};

export default Live;

function useViewLifecycle() {
  const actions = useActions({ enter, leave });
  useLifecycle(actions.enter, actions.leave);
}
