'use strict';

import { React, mui } from 'mylife-tools-ui';

import GroupTree from './group-tree';
import Toolbar from './toolbar';
import Header from './header';
import Footer from './footer';
import Table from './table';

const { makeStyles } = mui;

const useStyles = makeStyles(theme => ({
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row'
  },
  treeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  tree: {
    overflowY: 'auto',
    flex: '1 1 auto',
  },
  tableContainer: {
    flex: 5,
    display: 'flex',
    flexDirection: 'column',
  },
  table: {
    flex: '1 1 auto',
  }
}));

const Management = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <mui.Paper className={classes.treeContainer}>
        <GroupTree className={classes.tree}/>
        <mui.Divider />
        <Toolbar />
      </mui.Paper>
      <mui.Paper className={classes.tableContainer}>
        <Header />
        <Table className={classes.table}/>
        <Footer />
      </mui.Paper>
    </div>
  );
};

export default Management;
