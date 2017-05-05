'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import icons from '../icons';

import GroupMoveNodeContainer from '../../containers/management/group-move-node-container';

const GroupMoveNode = ({ level, group, children, onSelect }) => {
  return (
  <mui.ListItem
    onTouchTap={() => onSelect(group.id)}
    primaryText={<div style={{textAlign: 'left'}}>{group.display}</div>}
    leftIcon={<icons.Group />}
    nestedItems={children.map((child) => (<GroupMoveNodeContainer key={child.id} group={child} level={level+1} onSelect={onSelect} />))}
    nestedLevel={level}
    initiallyOpen={true} />
  );
};

GroupMoveNode.propTypes = {
  level    : PropTypes.number.isRequired,
  group    : PropTypes.object.isRequired,
  children : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onSelect : PropTypes.func.isRequired
};

export default GroupMoveNode;
