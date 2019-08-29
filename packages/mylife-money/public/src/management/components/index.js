'use strict';

import { React, mui, useMemo, useSelector, useDispatch, useLifecycle, useScreenSize } from 'mylife-tools-ui';
import { managementEnter, managementLeave } from '../actions';
import { isOperationDetail } from '../selectors';

import Tree from './tree';
import List from './list';
import Detail from './detail';

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
  detail: {
    flex: 5,
  },
});

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      detail: isOperationDetail(state)
    })),
    ...useMemo(() => ({
      enter : () => dispatch(managementEnter()),
      leave : () => dispatch(managementLeave()),
    }), [dispatch])
  };
};

const Management = () => {
  const classes = useStyles();
  const screenSize = useScreenSize();
  const { enter, leave, detail } = useConnect();
  useLifecycle(enter, leave);

  const main = detail ? (
    <Detail className={classes.detail} />
  ) : (
    <List className={classes.list} />
  );

  const normalLayout = (
    <div className={classes.container}>
      <Tree className={classes.tree} />
      {main}
    </div>
  );

  const smallLayout = (
    <div className={classes.container}>
      {main}
    </div>
  );

  switch(screenSize) {
    case 'phone':
      return smallLayout;

    case 'tablet':
    case 'laptop':
    case 'wide':
      return normalLayout;
  }
};

export default Management;
