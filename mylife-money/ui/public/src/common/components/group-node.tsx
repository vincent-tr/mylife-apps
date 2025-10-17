import { React, useState, useMemo, PropTypes, mui, useSelector } from 'mylife-tools-ui';
import icons from '../icons';
import { makeGetSortedChildren } from '../../reference/selectors';

type FIXME_any = any;

const useConnect = ({ group }) => {
  const getSortedChildren = useMemo(makeGetSortedChildren, []);
  return useSelector((state: FIXME_any) => ({
    children : getSortedChildren(state, { group })
  }));
};

const useStyles = mui.makeStyles(theme => ({
  listItem: (props: FIXME_any) => ({
    paddingLeft: theme.spacing(2 * (props.level + 1))
  })
}));

interface GroupNodeProps {
  level;
  group;
  selectedGroupId;
  onSelect;
  disabledGroupIds?;
  parentDisabled;
}

const GroupNode = ({ level, group, selectedGroupId, onSelect, disabledGroupIds, parentDisabled }: GroupNodeProps) => {
  const [open, setOpen] = useState(true);
  const classes = useStyles({ level });
  const { children } = useConnect({ group });
  const selected = selectedGroupId === group._id;
  const disabled = parentDisabled || !!(disabledGroupIds && disabledGroupIds.includes(group._id));
  const hasChildren = children.length > 0;
  return (
    <React.Fragment>
      <mui.ListItem button onClick={() => onSelect(group._id)} className={classes.listItem} selected={selected} disabled={disabled}>
        <mui.ListItemIcon><icons.Group /></mui.ListItemIcon>
        <mui.ListItemText primary={group.display} />
        {hasChildren && (
          <mui.IconButton size='small' onClick={(e) => { e.stopPropagation(); setOpen(!open); } }>
            {open ? <mui.icons.ExpandLess /> : <mui.icons.ExpandMore />}
          </mui.IconButton>
        )}
      </mui.ListItem>
      {hasChildren && (
        <mui.Collapse in={open} timeout="auto" unmountOnExit>
          <mui.List component="div" disablePadding>
            {children.map((child) => (<GroupNode key={child._id} group={child} level={level+1} onSelect={onSelect} selectedGroupId={selectedGroupId} disabledGroupIds={disabledGroupIds} parentDisabled={disabled} />))}
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
  selectedGroupId: PropTypes.string,
  disabledGroupIds: PropTypes.array,
  parentDisabled: PropTypes.bool
};

export default GroupNode;
