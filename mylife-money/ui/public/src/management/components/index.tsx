'use strict';

import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLifecycle, useScreenSize } from 'mylife-tools-ui';
import { managementEnter, managementLeave } from '../actions';
import { isOperationDetail } from '../selectors';
import { makeStyles } from '@material-ui/core';

import Tree from './tree';
import List from './list';
import Detail from './detail';

type FIXME_any = any;

const useStyles = makeStyles({
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row'
  },
  tree: {
  },
  list: {
    flex: '1 1 auto',
  },
  detail: {
    flex: 5,
  },
});

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
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
