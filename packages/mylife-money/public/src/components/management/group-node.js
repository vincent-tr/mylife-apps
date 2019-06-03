'use strict';

import { React, useState, PropTypes, mui } from 'mylife-tools-ui';
import icons from '../icons';

const { withTheme, makeStyles } = mui;

import GroupNodeContainer from '../../containers/management/group-node-container';

const useStyles = makeStyles(theme => ({
  listItem: props => ({
    paddingLeft: theme.spacing(2 * (props.level + 1))
  })
}));

const GroupNode = ({ level, selected, group, children, onSelect }) => {
  const [open, setOpen] = useState(true);
  const classes = useStyles({ level });
  return (
    <React.Fragment>
      <mui.ListItem button onClick={onSelect} className={classes.listItem} selected={selected}>
        <mui.ListItemIcon><icons.Group /></mui.ListItemIcon>
        <mui.ListItemText primary={group.display} />
        <mui.IconButton onClick={(e) => { e.stopPropagation(); setOpen(!open); } }>
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
  level    : PropTypes.number.isRequired,
  selected : PropTypes.bool.isRequired,
  group    : PropTypes.object.isRequired,
  children : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onSelect : PropTypes.func.isRequired
};

export default withTheme(GroupNode);
