import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import icons from '../icons';
import { makeGetSortedChildren } from '../../reference/selectors';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { makeStyles, ListItem, ListItemIcon, ListItemText, IconButton, Collapse, List } from '@material-ui/core';

type FIXME_any = any;

const useConnect = ({ group }) => {
  const getSortedChildren = useMemo(makeGetSortedChildren, []);
  return useSelector((state: FIXME_any) => ({
    children : getSortedChildren(state, { group })
  }));
};

const useStyles = makeStyles(theme => ({
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
  parentDisabled: boolean;
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
      <ListItem button onClick={() => onSelect(group._id)} className={classes.listItem} selected={selected} disabled={disabled}>
        <ListItemIcon><icons.Group /></ListItemIcon>
        <ListItemText primary={group.display} />
        {hasChildren && (
          <IconButton size='small' onClick={(e) => { e.stopPropagation(); setOpen(!open); } }>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </ListItem>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((child) => (<GroupNode key={child._id} group={child} level={level+1} onSelect={onSelect} selectedGroupId={selectedGroupId} disabledGroupIds={disabledGroupIds} parentDisabled={disabled} />))}
          </List>
        </Collapse>
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
