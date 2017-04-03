'use strict';

import React from 'react';
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
  level    : React.PropTypes.number.isRequired,
  group    : React.PropTypes.object.isRequired,
  children : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
  onSelect : React.PropTypes.func.isRequired
};

export default GroupMoveNode;
