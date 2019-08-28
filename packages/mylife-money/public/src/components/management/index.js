'use strict';

import { React, mui, useMemo, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { managementEnter, managementLeave } from '../../actions/management';

import Tree from './tree';
import List from './list';

const { makeStyles } = mui;

const useStyles = makeStyles({
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row'
  },
  tree: {
    flex: 1,
  },
  list: {
    flex: 5,
  },
});

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    enter : () => dispatch(managementEnter()),
    leave : () => dispatch(managementLeave()),
  }), [dispatch]);
};

const Management = () => {
  const classes = useStyles();
  const { enter, leave } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      <Tree className={classes.tree} />
      <List className={classes.list} />
    </div>
  );
};

export default Management;
