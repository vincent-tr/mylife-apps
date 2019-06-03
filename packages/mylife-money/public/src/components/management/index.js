'use strict';

import { React, Paper } from 'mylife-tools-ui';

import GroupTree from './group-tree';
import Toolbar from './toolbar';
import Header from './header';
import TableContainer from '../../containers/management/table-container';

import tabStyles from '../base/tab-styles';

const styles = {
  div:{
    display: 'flex',
    flexDirection: 'row wrap',
    width: '100%',
    height: '100%'
  },
  paperLeft:{
    flex: 1,
    height: '100%',
    textAlign: 'center',
  },
  paperRight:{
    flex: 5,
    height: '100%',
    textAlign: 'center',
  }
};

const Management = () => (
  <div style={styles.div}>
    <Paper style={Object.assign({}, styles.paperLeft, tabStyles.fullHeight)}>
      <div style={tabStyles.fullHeight}>
        <GroupTreeContainer />
        <Toolbar />
      </div>
    </Paper>
    <Paper style={Object.assign({}, styles.paperRight, tabStyles.fullHeight)}>
      <div style={tabStyles.fullHeight}>
        <Header />
        <TableContainer />
      </div>
    </Paper>
  </div>
);

export default Management;
