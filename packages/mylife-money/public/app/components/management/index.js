'use strict';

import React from 'react';
import * as mui from 'material-ui';

import TreeContainer from '../../containers/groups/tree-container.js';
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
    flex: 2,
    height: '100%',
    textAlign: 'center',
  }
};

const Management = () => (
  <div style={styles.div}>
    <mui.Paper zDepth={1} style={Object.assign({}, styles.paperLeft, tabStyles.fullHeight)}>
      <div style={tabStyles.fullHeight}>
        <TreeContainer />
        <ToolbarContainer />
      </div>
    </mui.Paper>
    <mui.Paper zDepth={1} style={Object.assign({}, styles.paperRight, tabStyles.fullHeight)}>
      <div style={tabStyles.fullHeight}>
        <HeaderContainer />
        <TableContainer />
      </div>
    </mui.Paper>
  </div>
);

Management.propTypes = {
};

export default Management;
