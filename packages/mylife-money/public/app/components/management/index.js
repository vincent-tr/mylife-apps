'use strict';

import React from 'react';
import * as mui from 'material-ui';

import TreeContainer from '../../containers/groups/tree-container.js';
import Toolbar from './toolbar.js';

import tabStyles from '../base/tab-styles';
import confirmDialog from '../base/confirm-dialog';

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

const Management = ({ onGroupCreate, onGroupEdit, onGroupDelete }) => (
  <div style={styles.div}>
    <mui.Paper zDepth={1} style={Object.assign({}, styles.paperLeft, tabStyles.scrollable, tabStyles.fullHeight)}>
      <div style={tabStyles.fullHeight}>
        <TreeContainer style={tabStyles.scrollable} />

        <Toolbar onGroupCreate={onGroupCreate}
                 onGroupEdit={onGroupEdit}
                 onGroupDelete={(...args) => confirmDialog(['Etes vous sur de vouloir supprimer le groupe ?'], 'Confirmation', (err, result) => result && onGroupDelete(...args))}
                 canChange={true}/>

      </div>
    </mui.Paper>
    <mui.Paper zDepth={1} style={Object.assign({}, styles.paperRight, tabStyles.scrollable, tabStyles.fullHeight)}>
        <p>Details</p>
    </mui.Paper>
  </div>
);

Management.propTypes = {
  onGroupCreate   : React.PropTypes.func.isRequired,
  onGroupEdit     : React.PropTypes.func.isRequired,
  onGroupDelete   : React.PropTypes.func.isRequired
};

export default Management;
