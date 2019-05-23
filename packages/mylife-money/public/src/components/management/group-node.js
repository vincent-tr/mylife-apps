'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as mui from '@material-ui/core';
import icons from '../icons';

const { withTheme } = mui;

import GroupNodeContainer from '../../containers/management/group-node-container';

const getStyle = (theme, selected) => {
  const style = {
    paddingLeft: theme.spacing(4)
  };
  if(selected) {
    style.backgroundColor = theme.palette.action.selected;
  }
  return style;
};

const GroupNode = ({ theme, level, selected, group, children, onSelect }) => {
  const [open, setOpen] = useState(true);
  return (
    <React.Fragment>
      <mui.ListItem button onClick={onSelect} style={getStyle(theme, selected)}>
        <mui.ListItemIcon><icons.Group /></mui.ListItemIcon>
        <mui.ListItemText primary={group.display} />
        <mui.IconButton onClick={() => setOpen(!open)}>
          {open ? <icons.tree.ExpandLess /> : <icons.tree.ExpandMore />}
        </mui.IconButton>
      </mui.ListItem>
      <mui.Collapse in={open} timeout="auto" unmountOnExit>
       <mui.List component="div" disablePadding>
         {children.map((child) => (<GroupNodeContainer key={child.id} group={child} level={level+1} />))}
       </mui.List>
     </mui.Collapse>
    </React.Fragment>
  );
};

GroupNode.propTypes = {
  theme    : PropTypes.object.isRequired,
  level    : PropTypes.number.isRequired,
  selected : PropTypes.bool.isRequired,
  group    : PropTypes.object.isRequired,
  children : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onSelect : PropTypes.func.isRequired
};

export default withTheme(GroupNode);
