'use strict';

import { React, mui } from 'mylife-tools-ui';

import GroupTree from './group-tree';
import Toolbar from './toolbar';
import Header from './header';
import Table from './table';

const { makeStyles } = mui;

const useStyles = makeStyles(theme => ({
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row'
  },
  treeContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
  tree: {
    overflowY: 'auto',
    flex: '1 1 auto',
  },
  tableContainer: {
    flex: 5,
    display: 'flex',
    flexDirection: 'column'
  }
}));

const Management = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <mui.Paper className={classes.treeContainer}>
        <div className={classes.tree}>
          <GroupTree/>
        </div>
        <Toolbar />
      </mui.Paper>
      {/*
      <mui.Container className={classes.tableContainer}>
        <Header />
        <Table />
      </mui.Container>
      */}
    </div>
  );
};

export default Management;
