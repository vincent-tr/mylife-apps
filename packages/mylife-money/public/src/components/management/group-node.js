'use strict';

import { React, useState, PropTypes, mui, createUseConnect } from 'mylife-tools-ui';
import icons from '../icons';
import { makeGetSortedChildren } from '../../selectors/groups';
import { getSelectedGroupId } from '../../selectors/management';
import { selectGroup } from '../../actions/management';

const { withTheme, makeStyles } = mui;

const useConnect = createUseConnect(
  () => {
    const getSortedChildren = makeGetSortedChildren();
    return (state, props) => ({
      selected : getSelectedGroupId(state) === props.group.id,
      children : getSortedChildren(state, props)
    });
  },
  (dispatch, props) => ({
    onSelect : () => dispatch(selectGroup(props.group.id)),
  })
);

const useStyles = makeStyles(theme => ({
  listItem: props => ({
    paddingLeft: theme.spacing(2 * (props.level + 1))
  })
}));

const GroupNode = ({ level, group }) => {
  const [open, setOpen] = useState(true);
  const classes = useStyles({ level });
  const { selected, children, onSelect } = useConnect();
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
         {children.map((child) => (<GroupNode key={child.id} group={child} level={level+1} />))}
       </mui.List>
     </mui.Collapse>
    </React.Fragment>
  );
};

GroupNode.propTypes = {
  level : PropTypes.number.isRequired,
  group : PropTypes.object.isRequired,
};

export default withTheme(GroupNode);
