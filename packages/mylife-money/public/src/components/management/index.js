'use strict';

import { React, mui, useMemo, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { managementEnter, managementLeave } from '../../actions/management';

import Tree from './tree';
import Toolbar from './toolbar';
import Header from './header';
import Footer from './footer';
import Table from './table';

const { makeStyles } = mui;

const useStyles = makeStyles({
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
      <mui.Paper className={classes.treeContainer}>
        <Tree className={classes.tree}/>
        <mui.Divider />
        <Toolbar />
      </mui.Paper>
      <mui.Paper className={classes.tableContainer}>
        <Header />
        <Table className={classes.table}/>
        <mui.Divider />
        <Footer />
      </mui.Paper>
    </div>
  );
};

export default Management;
