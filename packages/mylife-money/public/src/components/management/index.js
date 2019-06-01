'use strict';

import { React, Paper } from 'mylife-tools-ui';

import GroupTreeContainer from '../../containers/management/group-tree-container.js';
import ToolbarContainer from '../../containers/management/toolbar-container.js';
import HeaderContainer from '../../containers/management/header-container.js';
import TableContainer from '../../containers/management/table-container.js';

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
        <ToolbarContainer />
      </div>
    </Paper>
    <Paper style={Object.assign({}, styles.paperRight, tabStyles.fullHeight)}>
      <div style={tabStyles.fullHeight}>
        <HeaderContainer />
        <TableContainer />
      </div>
    </Paper>
  </div>
);

export default Management;
