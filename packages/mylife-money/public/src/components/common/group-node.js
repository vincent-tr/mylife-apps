import { React, useState, useMemo, PropTypes, mui, useSelector } from 'mylife-tools-ui';
import icons from '../icons';
import { makeGetSortedChildren } from '../../selectors/groups';

const useConnect = ({ group }) => {
  const getSortedChildren = useMemo(makeGetSortedChildren, []);
  return useSelector(state => ({
    children : getSortedChildren(state, { group })
  }));
};

const useStyles = mui.makeStyles(theme => ({
  listItem: props => ({
    paddingLeft: theme.spacing(2 * (props.level + 1))
  })
}));

const GroupNode = ({ level, group, selectedGroupId, onSelect }) => {
  const [open, setOpen] = useState(true);
  const classes = useStyles({ level });
  const { children } = useConnect({ group });
  const selected = selectedGroupId === group.id;
  const hasChildren = children.length > 0;
  return (
    <React.Fragment>
      <mui.ListItem button onClick={() => onSelect(group.id)} className={classes.listItem} selected={selected}>
        <mui.ListItemIcon><icons.Group /></mui.ListItemIcon>
        <mui.ListItemText primary={group.display} />
        {hasChildren && (
          <mui.IconButton size='small' onClick={(e) => { e.stopPropagation(); setOpen(!open); } }>
            {open ? <icons.tree.ExpandLess /> : <icons.tree.ExpandMore />}
          </mui.IconButton>
        )}
      </mui.ListItem>
      {hasChildren && (
        <mui.Collapse in={open} timeout="auto" unmountOnExit>
          <mui.List component="div" disablePadding>
            {children.map((child) => (<GroupNode key={child.id} group={child} level={level+1} onSelect={onSelect} selectedGroupId={selectedGroupId} />))}
          </mui.List>
        </mui.Collapse>
      )}
    </React.Fragment>
  );
};

GroupNode.propTypes = {
  level : PropTypes.number.isRequired,
  group : PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedGroupId: PropTypes.string
};

export default GroupNode;
