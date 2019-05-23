'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from '@material-ui/core';
import * as muiColorManipulator from 'material-ui/utils/colorManipulator';
import icons from '../icons';

const { withTheme } = mui;

import GroupNodeContainer from '../../containers/management/group-node-container';

const getStyle = (theme, selected) => {
  if(!selected) { return {}; }
  const textColor = theme.palette.textColor;
  const backgroundColor = muiColorManipulator.fade(textColor, 0.2);
  return { backgroundColor };
};

const GroupNode = ({ theme, level, selected, group, children, onSelect }) => (
  <mui.ListItem
    onTouchTap={onSelect}
    style={getStyle(theme, selected)}
    primaryText={<div style={{textAlign: 'left'}}>{group.display}</div>}
    leftIcon={<icons.Group />}
    nestedItems={children.map((child) => (<GroupNodeContainer key={child.id} group={child} level={level+1} />))}
    nestedLevel={level}
    initiallyOpen={true} />
);

GroupNode.propTypes = {
  theme    : PropTypes.object.isRequired,
  level    : PropTypes.number.isRequired,
  selected : PropTypes.bool.isRequired,
  group    : PropTypes.object.isRequired,
  children : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onSelect : PropTypes.func.isRequired
};

export default withTheme()(GroupNode);
