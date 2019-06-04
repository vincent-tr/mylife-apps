'use strict';

import { React, useState, useMemo, PropTypes, mui, useSelector, useDispatch } from 'mylife-tools-ui';
import icons from '../icons';
import { makeGetSortedChildren } from '../../selectors/groups';
import { getSelectedGroupId } from '../../selectors/management';
import { selectGroup } from '../../actions/management';

const { withTheme, makeStyles } = mui;

const useConnect = ({ group }) => {
  const getSortedChildren = useMemo(makeGetSortedChildren, []);
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      selected : getSelectedGroupId(state) === group.id,
      children : getSortedChildren(state, { group })
    })),
    ...useMemo(() => ({
      onSelect : () => dispatch(selectGroup(group.id))
    }), [dispatch, group])
  };
};

const useStyles = makeStyles(theme => ({
  listItem: props => ({
    paddingLeft: theme.spacing(2 * (props.level + 1))
  })
}));

const GroupNode = ({ level, group }) => {
  const [open, setOpen] = useState(true);
  const classes = useStyles({ level });
  const { selected, children, onSelect } = useConnect({ group });
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
