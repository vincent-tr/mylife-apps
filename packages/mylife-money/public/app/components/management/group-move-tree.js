'use strict';

import React from 'react';
import * as mui from 'material-ui';
import tabStyles from '../base/tab-styles';

import GroupMoveNodeContainer from '../../containers/management/group-move-node-container';

const GroupTree = ({ groups, onSelect }) => (
  <mui.List style={tabStyles.scrollable}>
    {groups.map((group) => (<GroupMoveNodeContainer key={group.id} group={group} level={0} onSelect={onSelect} />))}
  </mui.List>
);

GroupTree.propTypes = {
  groups   : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
  onSelect : React.PropTypes.func.isRequired
};

export default GroupTree;
