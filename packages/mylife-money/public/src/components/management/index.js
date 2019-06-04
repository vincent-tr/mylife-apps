'use strict';

import { React, mui, clsx } from 'mylife-tools-ui';

import GroupTree from './group-tree';
import Toolbar from './toolbar';
import Header from './header';
import Table from './table';

import tabStyles from '../base/tab-styles';

const { makeStyles } = mui;

const useStyles = makeStyles(() => ({
  div: {
    display: 'flex',
    flexDirection: 'row wrap',
  },
  paperLeft: {
    flex: 1,
    height: '100%',
    textAlign: 'center',
  },
  paperRight: {
    flex: 5,
    height: '100%',
    textAlign: 'center',
  },
  ...tabStyles
}));

const Management = () => {
  const classes = useStyles();
  return (
    <div className={classes.div}>
      <mui.Paper className={clsx(classes.paperLeft, tabStyles.fullHeight)}>
        <div className={classes.fullHeight}>
          <GroupTree />
          <Toolbar />
        </div>
      </mui.Paper>
      <mui.Paper className={clsx(classes.paperRight, tabStyles.fullHeight)}>
        <div className={classes.fullHeight}>
          <Header />
          <Table />
        </div>
      </mui.Paper>
    </div>
  );
};

export default Management;
