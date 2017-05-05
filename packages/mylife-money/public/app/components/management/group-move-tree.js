'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import tabStyles from '../base/tab-styles';

import GroupMoveNodeContainer from '../../containers/management/group-move-node-container';

const GroupTree = ({ groups, onSelect }) => (
  <mui.List style={tabStyles.scrollable}>
    {groups.map((group) => (<GroupMoveNodeContainer key={group.id} group={group} level={0} onSelect={onSelect} />))}
  </mui.List>
);

GroupTree.propTypes = {
  groups   : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onSelect : PropTypes.func.isRequired
};

export default GroupTree;
