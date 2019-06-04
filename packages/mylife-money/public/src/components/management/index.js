'use strict';

import { React, mui } from 'mylife-tools-ui';

import GroupTree from './group-tree';
import Toolbar from './toolbar';
import Header from './header';
import Table from './table';

const { makeStyles } = mui;

const useStyles = makeStyles(() => ({
  div: {
    display: 'flex',
    flexDirection: 'row',
  },
  tree: {
    flex: 1,
    textAlign: 'center',
    overflow: 'auto',
  },
  table: {
    flex: 5,
    textAlign: 'center',
    overflow: 'auto',
  }
}));

const Management = () => {
  const classes = useStyles();
  return (
    <div className={classes.div}>
      <mui.Container className={classes.tree}>
        <GroupTree />
        <Toolbar />
      </mui.Container>
      <mui.Container className={classes.table}>
        <Header />
        <Table />
      </mui.Container>
    </div>
  );
};

export default Management;
